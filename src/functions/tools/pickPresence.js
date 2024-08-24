const { ActivityType } = require("discord.js");

module.exports = (client) => {
  client.pickPresence = async () => {
    const option = {
        type: ActivityType.Listening,
        text: " /order",
        status: "online",
    }
    const option2 = {
        type: ActivityType.Playing,
        text: "in development",
        status: 'dnd',
    }

    client.user
      .setPresence({
        activities: [
          {
            name: option2.text,
            type: option2.type,
          },
        ],
        status: option2.status,
        // activities: [
        //   {
        //     name: option.text,
        //     type: option.type,
        //   },
        // ],
        // status: option.status,
      });
  };
};
