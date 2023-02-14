const {CLOSE, ABOUT, SERIAL, BACK} = require('./helpers');
module.exports = {
    gameOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: "0", callback_data: '0'}, {text: "1", callback_data: '1'}, {text: "2", callback_data: '2'}],
                [{text: "3", callback_data: '3'}, {text: "4", callback_data: '4'}, {text: "5", callback_data: '5'}]
            ]
        })
    },
    againOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: "Играть еще раз", callback_data: '/again'}]
            ]
        })
    },
    infoOptions: {
        reply_markup: {
            keyboard: [
                [{text: SERIAL}, {text: "Узнать погоду", request_location: true}],
                [{text: ABOUT}, {text: CLOSE}],
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        }
    },
    serialOptions: {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{text: "1 сезон(2015)", callback_data: 's1'}, {text: "2 сезон(2016)", callback_data: 's2'}, {text: "3 сезон(2017)", callback_data: 's3'}],
                [{text: "4 сезон(2018)", callback_data: 's4'}, {text: "5 сезон(2020)", callback_data: 's5'}, {text: "6 сезон(2022)", callback_data: 's6'}]
            ]
        })
    },
    backOptions: {
        reply_markup: JSON.stringify({
            keyboard: [
                [{text: BACK}, {text: CLOSE}]
            ],
            one_time_keyboard: true,
            resize_keyboard: true
        })
    },
}

