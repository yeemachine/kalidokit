# 第二版：扁平卡通角色与曲线动画

启动（不需要安装 Python 依赖）：

```powershell
python run_avatar.py
```

访问 http://localhost:8000/avatar/ 。默认没有配置 DeepSeek 也能使用默认角色、自动演示、面捕和本地拍照生成。

## 本版的变化

- 按用户第一张参考图的简化程度，以粗轮廓、纯色色块和符号化五官绘制角色。
- 角色由代码中的曲线与控制点生成，没有沿用上一版写实贴片。
- 眼睛以眼睑曲线裁剪瞳孔；嘴部是连续的贝塞尔轮廓，包含嘴角、开口和收圆控制。
- 头部绕颈部旋转，身体固定。左右转头与抬头低头通过不同部件的局部深度投影实现，不是完整三维重建。
- 使用 MediaPipe FaceMesh 478 点与 KalidoKit 1.1.5 的实际 Face.solve 求解姿态、眼睛、眉毛、视线、嘴型。
- KalidoKit 随项目提供，保留其 MIT 许可头。FaceMesh 首次使用时从 CDN 下载。
- 开启相机后可拍照，也可以上传照片。脸部比例由关键点测量；本地模式只估计比例和近似肤色，发型、眼镜沿用当前设置。
- DeepSeek 分析为可选项：在网页明确勾选后，仅在生成时向本机后端提交该照片，后端请求官方视觉 API，返回受限 JSON 外观参数。
- 所有表情驱动和显示在本地运行；DeepSeek 不参与逐帧动画。

## DeepSeek 配置

当前没有接触或配置用户密钥，也没有执行真实付费 API 调用。

可以先验证动画与本地拍照效果。需要启用 AI 外观分析时，在启动服务的 PowerShell 中设置 `DEEPSEEK_API_KEY`。建议使用隐藏输入：

```powershell
$avatarSecret = Read-Host "DeepSeek API Key" -AsSecureString
$env:DEEPSEEK_API_KEY = [System.Net.NetworkCredential]::new('', $avatarSecret).Password
Remove-Variable avatarSecret
python run_avatar.py
```

密钥只保留在这个 PowerShell 进程的环境变量里，不写入前端、仓库或图片。停止后可运行：

```powershell
Remove-Item Env:DEEPSEEK_API_KEY
```

默认使用官方文档当前列出的视觉模型 `deepseek-flash`。如账户支持的模型名不同，通过 `DEEPSEEK_MODEL` 环境变量设置。必须选择支持图片输入的模型。

## 技术边界

这是参数化卡通模板，不是任意图片自动转换成完整 Live2D Cubism 模型。角色发型目前有三种模板，服装结构固定；脸型、眼睛、眼镜和颜色可以变化。DeepSeek 提取外观参数，并不生成卡通 PNG。相似度受模板与照片光照影响，需要用户实际检查。

接口适配、模拟 API、图层/曲线渲染和模拟摄像头流程均可在没有密钥时验证。真实 DeepSeek 返回效果与真实摄像头响应仍需用户本机验证。

官方参考：

- https://github.com/yeemachine/kalidokit
- https://api-docs.deepseek.com/guides/vision/
- https://api-docs.deepseek.com/api/create-chat-completion/

## 回归检查

```powershell
python -m unittest discover -s tests -p "test_avatar_server.py"
node tests/avatar_model.test.js
```

这两项检查不请求摄像头，也不调用真实 DeepSeek API。
