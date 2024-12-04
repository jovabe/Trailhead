# Super Duper Chat

## Salesforce Chat

A custom chat component that listens to Messaging for In-App and Web (MIAW) chat activity and translates the incoming messages from both the enduser and the agent. An input text allows you to send out a translated message back to the MIAW chat window.

Components:
* LWC
  * Custom chat window
* Apex
  * Controller class for LWC
  * Service class to call Amazon Web Service
* Auth
  * Named Credential
  * External Credential
  * Auth provider

## Amazon Translate

A webservice that accepts a value and a target language and will return the translation.

Components:
* IAM
  * Role
* Cognito
  * User pool
  * App client configuration
* Lambda
  * Translate
* API Gateway
  * Authorizer -> Cognito
  * Resource -> Lambda -> Translate