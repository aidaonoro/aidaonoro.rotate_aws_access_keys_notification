console.log('Loading function');
var AWS = require('aws-sdk');

exports.handler = function(event, context) {
    console.log("Event received");
    var sns = new AWS.SNS({region: "us-east-1"});

    console.log(JSON.stringify(event));

    (event.Records || []).forEach(function(rec) {
        if (rec.Sns) {
            var parsed = JSON.parse(rec.Sns.Message);
            //var parsed = rec.Sns.Message;
            //console.log(parsed);
            if(parsed.detail["check-name"] == "IAM Access Key Rotation" && parsed.detail.status != "OK"){
                var comingUser = parsed.detail["check-item-detail"]["IAM User"];
                console.log("User who has to change access keys: " + comingUser);
                var envUser = process.env[comingUser];
                console.log("Matching user: " + envUser);
                if(envUser){
                    console.log("Sending email...");
                    var msg = "Hi! " + comingUser + "\n\n"
                            + "Your Access Keys life time is longer than 90 days in your " + process.env["awsAccount"] + " account, please follow next instructions:\n"
                            + "\t1. Create new Access Keys in your IAM User security credentials configuration.\n"
                            + "\t2. Make \"Inactive\" your old Access Keys.\n"
                            + "\t3. Replace your old credentials in your \"~/.aws/credentials\" file "
                            + "(and in every place you have them) with your new Access Keys.\n"
                            + "\t4. Validate your new credentials by making a call to the API. For example, execute "
                            + "\"aws ec2 describe-instances\"\n."
                            + "\t5. Delete your old Access Keys.\n"
                            + "\t6. Enjoy security!";
                    var params = {
                            Message: msg,
                            Subject: "Change Access Keys",
                            TopicArn: envUser
                    };

                    sns.publish(params, function(err, data) {
                            if (err) console.log(err, err.stack); // an error occurred
                            else     console.log(data);           // successful response
                    });

                }
            }
        }
    });
    console.log("Event ended");
};