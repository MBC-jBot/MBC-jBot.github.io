const jbc_bot_v1 = formatMessage => ({
    name: 'JBC_BOT_V1',
    extensionId: 'jbc_bot_v1',
    version: '3.3.1.0',
    supportDevice: ['arduinoUno', 'arduinoNano', 'arduinoLeonardo',
        'arduinoMega2560', 'arduinoEsp8266'],
    author: 'Dynamix',
    iconURL: `assets/jbc_bot_v1.png`,
    description: formatMessage({
        id: 'jbc_bot_v1.description',
        default: 'COOL JBC_BOT_V1'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    translations: 'translations.js',
    library: 'lib',
    official: true,
    tags: ['actuator'],
    helpLink: 'https://wiki.openblock.cc'
});

module.exports = jbc_bot_v1;
