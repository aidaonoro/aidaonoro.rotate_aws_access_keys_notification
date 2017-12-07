## Rotate AWS Access Keys Notifications Ansible Role

This role uses Ansible to create AWS resources that make notifications
for those who have access and secret keys older than 90 days.

This leverage the SNS features to send e-mails to the users who are required to
be notified. A CloudWatch Alarm will be created and associated to
the Trusted Advisor event which checks the status of the keys. When
the status is other than "OK", the alarm activates a Lambda
that will send the e-mail.

### Prerequisites

You need to provide the users and their e-mails.

### Usage example

    - include_role:
          name: aidaonoro.rotate_aws_access_keys_notification
        vars:
          account_id: "123456789012"
          awsAccount: {awsAccount: "Project environment"}
          subscripted_users:
            - {user: "MyUser1", endpoint: "myuser1@email.com"}
            - {user: "MyUser2", endpoint: "myuser2@email.com"}
            - {user: "MyUser3", endpoint: "myuser3@email.com"}

### Conclusion

Of course, this can be done by multiple ways. It is possible to
do it entirely using CloudFormation or even use SES instead of SNS.
It depends on what you are looking for or on your needs.