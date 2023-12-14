# Cloud Computing Team APIs
This repository includes all of Application Programming Interface to develop CloudRaya Mobile App that have main feature to detect anomaly metrics happen in CloudRaya's Virtual Machine to their respective users

# Documentations API - Detect Anomaly

## Template Response:

<br>

### Success:

<br>

```JS
// Response code 200, 201
{
    status: "success",
    data: (if data exist),
    message: (if message exist),
} 
```

<br>

### Fail:

<br>

```JS
// Response code 400, 401, 403, 404
{
    status: "fail",
    message: errorMessage
}
```

<br>

### Database Error => 

<br>

```JS
// Response code 503
{
    status: 'error',
    message: 'Database service unavailable',
} 
```

<br>

---

### Auth With OTP

<br>

> POST | https://cloudraya.e-cloud.ch/v1/api/gateway/user/auth

Header :
```TS
{
    Content-Type: application/json
}
```

Request Body:
```TS
{
    "app_key": "0a14b7a6-cfde-4b56-9b99-e6b02865e890",
    "secret_key": "u1vM84uEHTrrlNO3CesYJ8Rq4ry9uL15",
    "device_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiZGV2aWNlX2lkIjoiZmJ2aGJ1c2JlZHV3bnhzbXhza21rd2kiLCJpYXQiOjE1MTYyMzkwMjJ9.eSKNYgfVbwYC4VzBN1CIO3BEBRCLVpFHUlrO-LnKQkM"
}
```

Response on Success no OTP:
```TS
{
    "code": 200,
    "data": {
        "bearer_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLmNsb3VkcmF5YS5jb21cL3YxXC9hcGlcL2dhdGV3YXlcL3VzZXJcL2F1dGgiLCJpYXQiOjE3MDE0MDcxNjIsImV4cCI6MTcwMTQxNDM2MiwibmJmIjoxNzAxNDA3MTYyLCJqdGkiOiJnb2V3VlQzWDA5QjVoaFZuIiwic3ViIjo5OCwicHJ2IjoiYTU1NDE1NDk1MDQ1ODI1YzVlZTQ3NWMzMTZhYWVjOWRjMjYzZmE5MiJ9.9kg3__SKyaqmYZiRF0EGVrhAb4CQnjjjkHdR10-0QHQ",   
        "username": "Testing API",
        "expired_at": "2023-12-01 07:06:02",
        "timezone": "UTC",
        "refresh_token": "",
        "device_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZCI6IjFjMjlhOGMxODQ4MDRmYmQiLCJ1c2VyX2lkIjoiMjkyNCIsImlhdCI6MTcwMTQwNzE2MywiZXhwIjoxNzAyNjE2NzYzfQ.3x5QpzDOLRJ_FM5h41E5V7mZaZ9QqdCfHJciJKYykyk",
        "need_otp": false
    },
    "message": "success"
}
```

Response on Success need OTP:
```TS
{
    "code": 200,
    "data": {
        "need_otp": true,
        "otp_request_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyOTI0LCJlbWFpbCI6ImJhbmdraXR3b3dyYWNrQGdtYWlsLmNvbSIsImlhdCI6MTcwMTIzNjIxNywiZXhwIjoxNzAxMjM2ODE3fQ.l7f2qdAvBVp4_IpC-JCp5wLf76qQRde5o8qQH-m02gw"
    }
}
```

Response on Auth Failed:
```TS
{
    "code": 404,
    "error": "your credential not valid",
    "message": "your credential not valid"
}
```

<br>

### Request OTP Code

<br>

> POST | https://cloudraya.e-cloud.ch/v1/api/gateway/user/auth/get-otp

Header :
```TS
{
    Content-Type: application/json
}
```

Request Body :
```TS
{
    "otp_request_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyOTI0LCJlbWFpbCI6ImJhbmdraXR3b3dyYWNrQGdtYWlsLmNvbSIsImF1dGhfZGF0YV9jYWNoZSI6InJ1aS9BeDhLUHlBcHZkRWl5Ym5jcnc9PTpJQ3FGRjhxd3gvNXZJT09qdEJPUDRvdmpVVWt2KzRLY3RoNUFvWEp1c3RucWg0dzI1UGp0a2lqaXpLUkJDRG04YzNOKzNHNktVOG5zVVZMYUlkWkpZV0FvUEhrSkpNSm4yL1g0RUhKVVp2MWJUc3FyeXAxb0xMYTk4T2x3R2V0NFNid3NKTXZBOVpmTWluYTFmc0p6djNTdDE4NCtWcWxsTXRtZ2UxYVA5aERoTndlejRuWWJ4V0M4enc0QmxmRitJVTRNOE44UTdCR2Zucm5VTnpzVGF5c0xmalFQd3hSM1BKMGxCMEplcmhUNTUxTnJsZE52VWU0emU2VFBmS0RYTDRjWDlzM05yQU5pYTF3QXo4dlZmbTNhRjZmZHladjNyZkpBb1VVTlAwSlErNE5XekhzSzdpRWRQRElEMnh5QkJ3VFg2eDFPUDdDb0huTHgwWHlZc1EwUmF0T0QxYksyQUIvWktXYW5ZRDd1WlVNalBXeUpEQkxjUzhORlVZRkJaY21laFhicUNReHlidTNIQ3orVGNaOENORG5qOFRtWHQxc1RFOVVnSVFoTTcvcHhQeWRpUnBjZ0V5Q245MjhydFY2T0Z0MnoydmdhMUhIUWVqa3lSV2drZ29UM0tvVGlsSUQ3bVVlSkg1OEpxYk9WeGZNNXNQTlU3U09mVXZqQ01JVjZZeTVDUG9mbzNOYVdoRXFJNkRqVGpuc3grS1hEMmhqOUtGcFU3alUvVWhIUmpZVHM0UjhqTTBBemc5eWxLSlJWWVBTRHhuZlJHTWxXZXNZeTdCbjRpSStEYTdGNjF5K29CeitvZGg3MTYrU2w0L3ltREs0WWx4NWFBd0VCNTRUYUR0dTl4akRhRDFtZHZyWUpQNkR5NnY5TDFRa3IrOTNGUzAvaDREWT0iLCJpYXQiOjE3MDEzODU1MTUsImV4cCI6MTcwMjIxNjgwMH0.k0p4s63LE-b58ZuJMPLUMncoEZwoq3HP2A2eHFItjeA"
}
```

Response on Success :
```TS
{
    "code": 200,
    "data": {
        "verify_otp_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjkyNCIsImlhdCI6MTcwMTMwNjk4MSwiZXhwIjoxNzAxMzA3NTgxfQ.jtWX3tuZvTbItzCZ9JMpZViYusbv3nq3aDwJFw-PYb0",
        "message": "success",
        “email”: “bangkitwowrack@gmail.com
    }
}
```

Response on JWT Expired:
HTTP RESPONSE CODE 401 Unauthorized
```TS
{
    "code": 401,
    "error": "JWT error: jwt expired"
}

```

<br>

### Verify OTP Code :

<br>

> POST | https://cloudraya.e-cloud.ch/v1/api/gateway/user/auth/verify-otp

Header :
```TS
{
    Content-Type: application/json
}
```

Request Body :
```TS
{
    "otp": "533127",
    "otp_verify_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjkyNCIsImlhdCI6MTcwMTI3Mjc4OSwiZXhwIjoxNzAxMjczMzg5fQ.bKFmqtR5hdiRwrV3n3HNGS_KdYfoIgyfKWAtvDzek9I"
}
```

Response on Success :
HTTP RESPONSE 200
```TS
{
    "code": 200,
    "data": {
        "bearer_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvYXBpLmNsb3VkcmF5YS5jb21cL3YxXC9hcGlcL2dhdGV3YXlcL3VzZXJcL2F1dGgiLCJpYXQiOjE3MDEzODU1MTEsImV4cCI6MTcwMTM5MjcxMSwibmJmIjoxNzAxMzg1NTExLCJqdGkiOiJpN2duVk1MN09Rd0lVUDhuIiwic3ViIjo5OCwicHJ2IjoiYTU1NDE1NDk1MDQ1ODI1YzVlZTQ3NWMzMTZhYWVjOWRjMjYzZmE5MiJ9.-WUV3ugOvsvXCXbTT4cf51VCP0bzl7us2mxAHWNUxDc",
        "username": "Testing API",
        "expired_at": "2023-12-01 01:05:11",
        "timezone": "UTC",
        "refresh_token": "",
        “need_otp”: false,
        "device_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZCI6IjFjMjlhOGMxODQ4MDRmYmQiLCJ1c2VyX2lkIjoiMjkyNCIsImlhdCI6MTcwMTM4ODA2NSwiZXhwIjoxNzAyNTk3NjY1fQ.HgSyHtGPyrmpao5sH_BlEqLjLo9mSamMkMUblr-KmZ8"
    },
    "message": "success",
}
```

Response on Invalid OTP:
HTTP RESPONSE 401
```TS
{
    "code": 401,
    "error": "OTP is incorrect"
}

```

Response on JWT Expired:
HTTP RESPONSE 401
```TS
{
    "code": 410,
    "error": "JWT error: jwt expired"
}
```

<br>

### Logout :

<br>

> PUT | https://cloudraya.e-cloud.ch/v1/api/gateway/user/auth/logout

Header :
```TS
{
    Content-Type: application/json
}
```

Request Body :
```TS
{
    "user_id": 2924
}
```

Response on Success :
HTTP RESPONSE 200
```TS
{
    "code": 200,
    "data": {
        "code": 200,
        "message": "success",
    }
}
```

Response on Failed:
HTTP RESPONSE 500
```TS
{
    "code": 500,
	"error": “error message here”

}

```

<br>

### Sending Email :

<br>

> POST | https://cloudraya.e-cloud.ch/v1/api/gateway/user/notification/send-mail

Header :
```TS
{
    Content-Type: application/json
}
```

Request Body :
```TS
{
    "from_email": "CloudRaya App Auth System <bangkitwowrack@gmail.com>",
	"email_subject": "CloudRaya App OTP for you to login",
	"email": "c133bsy3532@bangkit.academy",
	"email_body": "html code here"
}
```

Response on Success :
HTTP RESPONSE 200
```TS
{
    "code": 200,
    "message": "success"
}
```

Response on Failed:
HTTP RESPONSE 500
```TS
{
    "code": 500,
	"error": “error message here”

}

```

<br>

### CPU and Memory Usage :

<br>

> POST | https://cloudraya.e-cloud.ch/v1/api/gateway/user/virtualmachines/usages?page=3&size=5

Header :
```TS
{
    Content-Type: application/json
}
```

Request Body :
```TS
{
    "vm_id": 6380
}
```

Response on Success :
HTTP RESPONSE 200
```TS
{
    "code": 200,
    "data": [
        {
            "cpuUsed": 55.971535,
            "memoryUsed": 49.424240000000005,
            "timestamp": "2023-12-04T22:50:00.000000Z"
        },
        {
            "cpuUsed": 51.013264,
            "memoryUsed": 51.92349000000001,
            "timestamp": "2023-12-04T22:55:00.000000Z"
        },
        {
            "cpuUsed": 53.247963,
            "memoryUsed": 52.344744,
            "timestamp": "2023-12-04T23:00:00.000000Z"
        },
        {
            "cpuUsed": 54.023144,
            "memoryUsed": 50.21025,
            "timestamp": "2023-12-04T23:05:00.000000Z"
        },
        {
            "cpuUsed": 55.869953,
            "memoryUsed": 48.554950000000005,
            "timestamp": "2023-12-04T23:10:00.000000Z"
        }
    ],
    "message": "Success get Usage VM data"
}
```

Response on Failed:
HTTP RESPONSE 500
```TS
{
    "code": 500,
	"error": “error message here”

}

```

<br>

### Bandwidth Usage :

<br>

> POST | https://cloudraya.e-cloud.ch/v1/api/gateway/user/virtualmachines/bandwidths?page=3&size=5

Header :
```TS
{
    Content-Type: application/json
}
```

Request Body :
```TS
{
    "vm_id": 6380
}
```

Response on Success :
HTTP RESPONSE 200
```TS
{
    "code": 200,
    "data": [
        {
            "usage": 0.00031637237,
            "cost": 0,
            "type": "sent",
            "timestamp": "2023-12-05T08:00:00.000000Z"
        },
        {
            "usage": 0.00017749156,
            "cost": 0,
            "type": "received",
            "timestamp": "2023-12-05T08:00:00.000000Z"
        },
        {
            "usage": 0.0006207515,
            "cost": 0,
            "type": "sent",
            "timestamp": "2023-12-05T09:00:00.000000Z"
        },
        {
            "usage": 0.00084910844,
            "cost": 0,
            "type": "received",
            "timestamp": "2023-12-05T09:00:00.000000Z"
        },
        {
            "usage": 0.000715898,
            "cost": 0,
            "type": "sent",
            "timestamp": "2023-12-05T10:00:00.000000Z"
        },
        {
            "usage": 0.000102030914,
            "cost": 0,
            "type": "received",
            "timestamp": "2023-12-05T10:00:00.000000Z"
        },
        {
            "usage": 0.0006710948,
            "cost": 0,
            "type": "sent",
            "timestamp": "2023-12-05T11:00:00.000000Z"
        },
        {
            "usage": 0.00032394473,
            "cost": 0,
            "type": "received",
            "timestamp": "2023-12-05T11:00:00.000000Z"
        },
        {
            "usage": 0.0009411833,
            "cost": 0,
            "type": "sent",
            "timestamp": "2023-12-05T12:00:00.000000Z"
        },
        {
            "usage": 0.00013945272,
            "cost": 0,
            "type": "received",
            "timestamp": "2023-12-05T12:00:00.000000Z"
        }
    ],
    "message": "Success get bandwidth VM data"
}
```

Response on Failed:
HTTP RESPONSE 500
```TS
{
    "code": 500,
	"error": “error message here”

}

```

<br>

### Notification List :

<br>

> GET | https://cloudraya.e-cloud.ch/v1/api/gateway/user/auth/show-notif?page=1&size=2

Header :
```TS
{
    Authorization: Bearer ...token...
}
```

Response on Success :
```TS
{
    "code": 200,
    "data": [
    	{
        	"id": "3",
        	"title": "CPU Anomaly Detected",
            "description": "Check your virtual machine (Test) now to make sure the root cause",
        	"timestamp": 1702360581636,
        	"vm_id": 6380
    	},
    	{
        	"id": "2",
        	"title": "CPU Anomaly Detected",
            "description": "Check your virtual machine (Test) now to make sure the root cause",
        	"timestamp": 1702360581636,
        	"vm_id": 6380
        }
	],
	"message": "Success get list notifications data"
}
```

Response on Failed:
HTTP RESPONSE 500
```TS
{
    "code": 500,
	"error": “error message here”

}

```

<br>

### Veryfy FCM Token :

<br>

> POST | https://cloudraya.e-cloud.ch/v1/api/gateway/user/auth/verify-fcm

Header :
```TS
{
    Authorization: Bearer ...token...
}
```

Request Body :
```TS
{
	“fcm_token”: “wdbwbibidsch”,
    “device_id”: “hesvgewvgetvh”
}
```

Response on Success :
HTTP RESPONSE 200
```TS
{
    "code": 200,
	"message": "FCM token is valid"
}
```

Response on Failed:
HTTP RESPONSE 400
```TS
{
    "code": 400,
	"error": "error message here",
    "message": "FCM token is valid"
}

```

<br>

## Author
1️⃣ Irfan Noor Hidayat | Politeknik Negeri Samarinda
2️⃣ Gusti Agung Kurniawan | Politeknik Pertanian Negeri Samarinda
