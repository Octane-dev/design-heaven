module.exports = {
    data: {
        name: 'order-cancel'
    },
    async execute(interaction,client) {
        await interaction.update({
            content: 'Order cancelled.',
            components: [],
        });
    }
};