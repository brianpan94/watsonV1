const AssistantV1 = require('ibm-watson/assistant/v1');
const {IamAuthenticator} = require('ibm-watson/auth');
const fs = require('fs');
const YAML = require('yaml');
const workspace = YAML.parse(
  fs.readFileSync(`./configs/assistant.yaml`).toString(),
).assistant.map(
  ({url, apiKey}) => ({url, apiKey}),
);

// 只取第一個url，若有跨url需再調整
const {url, apiKey} = workspace[0];

module.exports = class Assistant extends AssistantV1 {
  /**
   * assistant 參數
   */
  constructor() {
    super({
      version: '2021-06-14',
      authenticator: new IamAuthenticator({
        apikey: apiKey,
      }),
      serviceUrl: url,
    });
  }

  /**
   * 傳訊息給 watson
   * @param {string} workspaceID workspaceID
   * @param {string} user userID
   * @param {object} userSay userSay
   * @param {object} context conversationID or last Context
   * @return {object} assitant
   */
  async message(workspaceID, user, userSay, context) {
    try {
      console.log('watson context:', context);
      if (context.context) {
        context = context.context;
      }
      const response = await super.message({
        workspaceId: workspaceID,
        input: {'text': userSay},
        context: context,
      });
      context[user] = response.result.context;
      return response.result;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
};
