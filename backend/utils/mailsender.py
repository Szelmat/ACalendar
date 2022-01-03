# This is just an example code for starting out. It probably won't work for now!

from mailjet_rest import Client
import os
api_key = '7bb0ed14b443422d473ee321fb94aa13'
api_secret = '2730749e1da70e30b08c3b34c9d00dd1'
mailjet = Client(auth=(api_key, api_secret), version='v3.1')
data = {
    'Messages': [
        {
            "From": {
                "Email": "pd2rl2@inf.elte.hu",
                "Name": "Máté"
            },
            "To": [
                {
                    "Email": "pd2rl2@inf.elte.hu",
                    "Name": "Máté"
                }
            ],
            "Subject": "Greetings from Mailjet.",
            "TextPart": "My first Mailjet email",
            "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
            "CustomID": "AppGettingStartedTest"
        }
    ]
}
result = mailjet.send.create(data=data)
print(result.status_code)
print(result.json())
