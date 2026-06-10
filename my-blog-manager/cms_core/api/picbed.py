import base64
import uuid
from datetime import datetime
from fastapi import APIRouter, Body, UploadFile, File, Form
import httpx

router = APIRouter()

def extract_repo(url: str) -> str:
    repo = url.strip().rstrip('/')
    if repo.startswith("https://github.com/"):
        repo = repo.replace("https://github.com/", "")
    elif repo.startswith("http://github.com/"):
        repo = repo.replace("http://github.com/", "")
    elif repo.startswith("github.com/"):
        repo = repo.replace("github.com/", "")
    if repo.endswith(".git"):
        repo = repo[:-4]
    return repo

@router.post("/test")
async def test_picbed_connection(payload: dict = Body(...)):
    raw_url = payload.get("url", "")
    repo = extract_repo(raw_url)
    token = payload.get("token", "").strip()

    if not repo or not token:
        return {"success": False, "message": "GitHub 仓库地址和 Token 不能为空"}

    if token.startswith("Bearer "):
        token = token[7:]

    test_endpoint = f"https://api.github.com/repos/{repo}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(test_endpoint, headers=headers)
            if response.status_code == 200:
                data = response.json()
                permissions = data.get("permissions", {})
                if permissions.get("push"):
                    return {"success": True, "message": f"连接成功！仓库: {data.get('full_name')}，具备写入权限。"}
                else:
                    return {"success": False, "message": "连接成功，但该 Token 对此仓库没有写入(push)权限！"}
            elif response.status_code == 404:
                return {"success": False, "message": "找不到该仓库，请检查拼写或 Token 权限。"}
            elif response.status_code == 401:
                return {"success": False, "message": "Token 无效或已过期。"}
            else:
                return {"success": False, "message": f"校验失败，GitHub 返回 {response.status_code}。"}
    except Exception as e:
        return {"success": False, "message": f"网络异常: {str(e)}"}

@router.post("/upload")
async def upload_image(
        file: UploadFile = File(...),
        url: str = Form(...),
        token: str = Form(...)
):
    repo = extract_repo(url)
    token = token.strip()

    if token.startswith("Bearer "):
        token = token[7:]

    now = datetime.now()
    date_path = now.strftime("%Y/%m/%d")
    unique_id = uuid.uuid4().hex[:8]
    safe_filename = file.filename.replace(" ", "_")
    file_path = f"images/{date_path}/{unique_id}-{safe_filename}"

    upload_endpoint = f"https://api.github.com/repos/{repo}/contents/{file_path}"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }

    try:
        content = await file.read()
        encoded_content = base64.b64encode(content).decode("utf-8")

        payload = {
            "message": f"Upload image {safe_filename} via blog manager",
            "content": encoded_content
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.put(upload_endpoint, headers=headers, json=payload)

            if response.status_code in [201, 200]:
                branch = "main" # 默认推送到 main 分支
                img_url = f"https://cdn.jsdelivr.net/gh/{repo}@{branch}/{file_path}"
                return {"success": True, "message": "上传成功", "url": img_url}
            else:
                err_data = response.json()
                return {"success": False, "message": f"GitHub 拒绝接收: {err_data.get('message', '未知')}"}
    except httpx.ReadTimeout:
        return {"success": False, "message": "图片上传超时，请检查网络或图片是否过大"}
    except Exception as e:
        return {"success": False, "message": f"服务器异常: {str(e)}"}