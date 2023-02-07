const AssistantService = require('../services/WatsonAssitantV1');
const fs = require('fs');
const YAML = require('yaml');
const workspace = YAML.parse(
  fs.readFileSync(`./configs/assistant.yaml`).toString(),
).assistant.map(
  ({name, workspaceID}) => ({name, workspaceID}),
);


module.exports = class AssitantController {
  /**
  * 發送request詢問watson
  * @async
  * @param {Request} req
  * @param {Response} res
  * @return {Promise<object>} watson回傳內容
  * @see [Assistant回傳內容詳細] (https://cloud.ibm.com/apidocs/assistant-v1#message)
  */
  async callWatson(req, res) {
    try {
      const {userID, text, contextData}=req.body;
      const service = new AssistantService();

      const promiseArray = await workspace.map(
        async ({workspaceID, name: skill}) => {
          return {
            skill,
            ...(await service.message(workspaceID, userID, text, contextData)),
          };
        });
     
      let messages = [];
      await Promise.all(promiseArray)
        .then((values) =>{
          values.map((v) => {
            const data = {
              status: 'fulfilled',
              value: v,
            };
            messages.push(data);
          });
        })
        .catch((reason) => {
          const data = {
            status: 'rejected',
            reason: reason.message,
          };
          messages.push(data);
        });

      // 排序
      messages = messages.sort(
        (a, b) => (b.value.intents[0] ? b.value.intents[0].confidence : 0) -
          (a.value.intents[0] ? a.value.intents[0].confidence: 0),
      );

      // 情境判斷
      let inScenario;
      if (contextData.context && contextData.context.scenario) {
        inScenario = true;
      } else {
        inScenario = false;
      }

      if (inScenario) {
        console.log('in scenario');
        const skillIndex = messages.findIndex(({value}) =>
          value.skill === contextData.skill);
        // 判斷assistant 是否為空
        if (messages[skillIndex].value.intents != false) {
          const currentMessage = messages.splice(skillIndex, 1);
          messages = [currentMessage[0], ...messages];
        }
      }

      messages = messages.map(({value}) => value);

      if (!messages) {
        res.status(500).json({messages: 'error by getting response'});
      } else {
        res.status(200).json({messages: messages});
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({messages: e.message});
    }
  }
  /**
   * @constructor
   */
  constructor() {
    this.callWatson = this.callWatson.bind(this);
  }
};
