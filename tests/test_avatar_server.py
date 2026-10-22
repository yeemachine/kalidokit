import base64
import io
import json
import os
import sys
import threading
import unittest
import urllib.error
import urllib.request
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import run_avatar as app


class AvatarServerTests(unittest.TestCase):
    def test_parameters_are_bounded_and_never_executable(self):
        value = app.sanitize_appearance({"hairColor": "<script>", "hairVolume": 999, "glasses": "false", "eyeSize": float("nan"), "hairStyle": "wavy", "payload": "evil"})
        self.assertEqual(value, {"hairVolume": 1.4, "hairStyle": "wavy"})

    def test_rejects_invalid_image_payload(self):
        for value in (None, "https://example.com/image.jpg", "data:image/png;base64,AAAA"):
            with self.assertRaises(ValueError):
                app.validate_image(value)

    def test_api_adapter_with_mocked_provider(self):
        payload = {"choices": [{"message": {"content": json.dumps({"glasses": True, "hairColor": "#121212", "hairStyle": "short"})}}]}
        with patch.dict(os.environ, {"DEEPSEEK_API_KEY": "test-key-never-returned"}), patch.object(app.urllib.request, "urlopen", return_value=io.BytesIO(json.dumps(payload).encode())) as provider:
            result = app.analyze_appearance("data:image/jpeg;base64,test")
        self.assertEqual(result["hairStyle"], "short")
        request = provider.call_args.args[0]
        self.assertEqual(request.full_url, "https://api.deepseek.com/chat/completions")
        body = json.loads(request.data)
        self.assertEqual(body["response_format"], {"type": "json_object"})
        self.assertEqual(body["thinking"], {"type": "disabled"})
        self.assertIn("image_url", str(body["messages"][1]["content"]))
        self.assertNotIn("test-key", str(result))

    def test_local_http_status_static_and_origin(self):
        server = app.ThreadingHTTPServer(("127.0.0.1", 0), app.Handler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        url = "http://127.0.0.1:%s" % server.server_address[1]
        try:
            with patch.dict(os.environ, {"DEEPSEEK_API_KEY": ""}):
                with urllib.request.urlopen(url + "/api/status") as response:
                    self.assertEqual(json.load(response), {"configured": False})
                with urllib.request.urlopen(url + "/avatar/") as response:
                    self.assertIn("vendor/kalidokit.umd.js", response.read().decode())
                jpeg = "data:image/jpeg;base64," + base64.b64encode(b"\xff\xd8\xff" + b"0" * 20).decode()
                request = urllib.request.Request(url + "/api/appearance", data=json.dumps({"image": jpeg}).encode(), headers={"Content-Type": "application/json"})
                with self.assertRaises(urllib.error.HTTPError) as error:
                    urllib.request.urlopen(request)
                self.assertEqual(error.exception.code, 503)
                request.add_header("Origin", "https://unrelated.example")
                with self.assertRaises(urllib.error.HTTPError) as error:
                    urllib.request.urlopen(request)
                self.assertEqual(error.exception.code, 403)
        finally:
            server.shutdown()
            server.server_close()
            thread.join(2)


if __name__ == "__main__":
    unittest.main()
