const {gameOptions, againOptions, infoOptions, serialOptions, backOptions} = require("./options"); //keybords
const TelegramApi = require('node-telegram-bot-api');
const axios = require("axios");
const {TOKEN, START, INFO, GAME, AUDIO, CLOSE, ABOUT, SERIAL, GID, AGAIN, seasons, BACK} = require('./helpers'); //commands
const fs = require('fs');
const {season_1, season_2, season_3, season_4, season_5, season_6} = require('./data/database.js') //data



const bot = new TelegramApi(TOKEN,  {polling: true})
const chats = {}


//basic functions (message, callback_query, inline_query)
async function getMessage(message) {
    const text = message.text
    const chatId = message.chat.id
    let WEATHER = message.location?.latitude
    if(WEATHER) {
        const lat = message.location.latitude
        const lon = message.location.longitude
        return  getWeather(lat, lon, chatId)
    }

    switch(text) {
        case START:
            let answer = `Добро пожаловать ${message.from.first_name}. Сразу обозначу: я не адвокат по криминалу, я криминальный адвокат. Смекаешь?`
            await bot.sendPhoto(chatId, 'https://damion.club/uploads/posts/2022-09/1664202360_47-damion-club-p-sol-gudman-akter-oboi-55.jpg', {caption: answer})
            await bot.sendMessage(chatId, 'Ты можешь воспользоваться клавиатурой или меню слева', infoOptions)
            break
        case INFO:
            await bot.sendMessage(chatId, 'Выберете действие', infoOptions)
            break
        case CLOSE:
            await bot.sendMessage(chatId, 'Выполнено закрытие клавиатуры', {reply_markup: {remove_keyboard: true}})
            break
        case GAME:
            await setRandomNumber(chatId)
            break
        case AUDIO:
            await bot.sendMessage(chatId, 'Загрузка аудио... Наслаждайся!')
            await fs.readFile(__dirname + '/audio/Better_Call_Saul.mp3', (err, data) => bot.sendAudio(chatId, data))
            break
        case ABOUT:
            await bot.sendMessage(chatId, `Ты назвался ${message.from.first_name}. Твой ник - ${message.from.username} с уникальным ключом ${message.from.id}.`)
            break
        case SERIAL:
            await getInfoForSerial(chatId)
            break
        case GID:
            await getInfoForSerial(chatId)
            break
        case BACK:
            await getInfoForSerial(chatId)
            break
        default:
            await bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз!`)
            break
    }
}
async function checkCallbackQuery(message) {
    const chatId = message.message.chat.id
    const data = message.data

    if(data.includes('s')) {
        switch (data) {
            case seasons.one:
                await createHTMLCodeForSeries(season_1, chatId)
                break
            case seasons.two:
                await createHTMLCodeForSeries(season_2, chatId)
                break
            case seasons.three:
                await createHTMLCodeForSeries(season_3, chatId)
                break
            case seasons.four:
                await createHTMLCodeForSeries(season_4, chatId)
                break
            case seasons.five:
                await createHTMLCodeForSeries(season_5, chatId)
                break
            case seasons.six:
                await createHTMLCodeForSeries(season_6, chatId)
                break
            default:
                await createHTMLCodeForSeries(season_1, chatId)
                break
        }
    } else {
        if(+data === chats[chatId]) {
            await bot.sendMessage(chatId, `Отлично! Ииииииииииии....`)
            await bot.sendPhoto(chatId, 'https://1.bp.blogspot.com/-PIMlFtsKC_Q/YCeskVVEtfI/AAAAAAAAB_8/htN70Xz4fc8FXC-d0Jdz-rIqNZJ_PdvRACLcBGAsYHQ/w640-h360/8m6c3kilrar31.jpg')
            return bot.sendMessage(chatId, '🥇 И это правильный ответ!!! У тебя чуйка адвоката! 🎺', againOptions)
        } else if (data === AGAIN) {
            await bot.answerCallbackQuery(message.id, `Сыграть еще раз`)
            return setRandomNumber(chatId)
        } else {
            await bot.sendMessage(chatId, `Отлично! Ииииииииииии....`)
            await bot.sendPhoto(chatId, 'https://sun9-12.userapi.com/impg/73e1v8_Lg8rlm94LC-I2VILWbQl8MrGjxAklvg/TxQWYC2u1nc.jpg?size=200x133&quality=96&crop=98,0,1083,720&sign=6fe8966ee5b28039139ab42491210e4b&c_uniq_tag=u4WfyCy-GBoZ4YrV82PjapzvxHKWMuRWoinNysHpDdE&type=album')
            return bot.sendMessage(chatId, `И это неправильный ответ( Я загадал цифру ${chats[chatId]}.`, againOptions)
        }
    }
}
function setInlineQueryParams(query) {
    let results = [{type: 'photo', id: 1, title: "Лучше звоните солу", description: "Лучше звоните солу", caption: "Лучше звоните солу", photo_url: season_1[0].picture, thumb_url: season_1[0].picture, reply_markup: {inline_keyboard: [[{text: "Смотреть", url: 'https://call-saul.online/'}]]}}]
    bot.answerInlineQuery(query.id, results, {cache_time: 0})
}



//auxiliary functions
async function getInfoForSerial(chatId) {
    return bot.sendMessage(chatId, 'Выбери сезон', serialOptions)
}
async function createHTMLCodeForSeries(season, chatId) {
    let i = 0
    while (i < season.length) {
        let html = `<b>Серия ${i + 1}: ${season[i].name}</b> \n<code>Дата выхода: ${season[i].date}</code> \nРейтинг: <b>${season[i].rate}</b> \n <pre>${season[i].desc}</pre> \n <a href="${season[i].link}">Cмотреть</a>`;
        await bot.sendPhoto(chatId, season[i].link, {caption: html, parse_mode: 'HTML'})
        i++
    }
    return bot.sendMessage(chatId, 'Ты можешь посмотреть другой сезон', backOptions)
}
async function setRandomNumber(id) {
    await bot.sendMessage(id, 'Cейчас я загадаю число от 1 до 5, а ты его отгадай!');
    let randomNumber = Math.floor(Math.random() * 6);
    chats[id] = randomNumber;
    await bot.sendMessage(id, 'Готово! Можешь начинать!', gameOptions);
}
async function getWeather(latitude, longitude, chatId) {
    try {
        const url = `http://api.weatherapi.com/v1/current.json?key=4c07b8ea3a3e41ca84a204641230902&q=${latitude}&q=${longitude}&aqi=no`
        let responce = await axios.get(url)
        const data = responce.data
        let answer = `Последнее обновление базы ${data.current.last_updated || '-'}.\n Точное время ${data.location.localtime || '-'}, за окном ${data.current.is_day ? 'день' : 'ночь'}.\n Ты находишься в ${data.location.region || '-'} недалеко от ${data.location.name || '-'}.\n Температура ${data.current.temp_c || '-'} градусов, ощущается как ${data.current.feelslike_f || '-'}.\n Ветер ${data.current.wind_kph || '-'} км/ч.`
        await bot.sendMessage(chatId, answer)
    } catch (e) {
        console.error(e)
    }
}



//handlers bot
function init() {
    bot.setMyCommands([
        {command: INFO, description: 'Мои возможности'},
        {command: GAME, description: 'Играть со мной в игру'},
        {command: AUDIO, description: 'Получить годноту'},
        {command: GID, description: 'Гид по сериалу'},
    ])
    bot.on('message', getMessage)
    bot.on('callback_query', checkCallbackQuery)
    bot.on('inline_query', setInlineQueryParams)
}
init()


