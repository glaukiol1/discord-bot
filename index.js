const data = require('./data.json');
const Discord = require('discord.js')
const bot = new Discord.Client()
const aboutUs = data.server.aboutUs;
const token = data.bot.key;
const ms = require('ms')
var prefix = data.bot.prefix;
var name = data.bot.name;

bot.on('message', message => {
  let args = message.content.substring(prefix.length).split(' ')
  if (message.content[0]===prefix) {
  switch (args[0]) {
    case 'dm':
      if (
        !message.member.roles.cache.find(r => r.name == '+') ||
        !message.member.roles.cache.find(r => r.name == 'Moderator')
      ) {
        return message.channel.send(
          'You do not have the required role to run this command!'
        )
      } else {
        const mentionDm = message.mentions.users.first()
        if (!mentionDm) return 'Invalid Args'
        const mentionMessage = message.content.slice(3)
        mentionDm.send(mentionMessage)
        message.delete()
        message.channel.send('DM sent!')
      }
      break
    case 'ban':
      if (
        !message.member.roles.cache.find(r => r.name == '+') ||
        !message.member.roles.cache.find(r => r.name == 'Moderator')
      ) {
        return message.channel.send(
          'You do not have the required role to run this command!'
        )
      } else {
        if (!args[1]) message.channel.send('Invalid Args')
        let user = message.mentions.users.first()
        if (user) {
          const member = message.guild.member(user)
          if (member) {
            const reason = message.content.slice(4)
            message.channel.send(
              `!dm ${member} You got banned! Reason: ${reason}`
            )
            member
              .ban({ reason })
              .then(() => message.channel.send('Banned the user'))
              .then(() => {
                const date = new Date()
                const log = message.guild.channels.cache.find(
                  channel => channel.name === 'bot-log'
                )
                const EmbedLog = new Discord.MessageEmbed()
                  .setTitle('User Banned')
                  .setDescription(`${member} was struck by the ban-hammer!`)
                  .addField('User Banned:', member)
                  .addField('Reason:', reason)
                  .addField('Mod Responsible:', `@${message.member.user.tag}`)
                  .setFooter(date)
                log.send(EmbedLog)
              })
          } else {
            message.reply('That user isnt in the server')
          }
        } else {
          message.reply('That user isnt in the server')
        }
      }
      break
    case 'ping':
      message.channel.send('pong!')
      break
    case 'info':
      if (args[1] === 'discord') {
        message.channel.send(aboutUs)
      } else {
        message.reply('Invalid Args')
      }
      break
    case 'clear':
      if (
        !message.member.roles.cache.find(r => r.name == '+') ||
        !message.member.roles.cache.find(r => r.name == 'Moderator')
      ) {
        return message.channel.send(
          'You do not have the required role to run this command!'
        )
      } else {
        if (args[1]) {
          message.channel.bulkDelete(args[1])
        } else {
          message.reply('Invalid Args')
        }
      }
      break
    case 'me':
      const embed = new Discord.MessageEmbed()
        .setTitle('User Info')
        .addField('Player Name', message.author.username)
        .addField('Current Server', message.guild.name)
        .addField('Role (Highest)', message.member.roles.highest)
        .setThumbnail(message.author.avatarURL())
        .setFooter(`Came to you by @${name}!`)
        .setColor(0xf1c40f)
      message.channel.send(embed)
      break
    case 'mute':
      if (
        !message.member.roles.cache.find(r => r.name == '+') ||
        !message.member.roles.cache.find(r => r.name == 'Moderator')
      ) {
        return message.channel.send(
          'You do not have the required role to run this command!'
        )
      } else {
        let person = message.guild.member(
          message.mentions.users.first() ||
            message.guild.members.cache.get(args[1])
        )
        if (!person) return message.reply('I cant find that member!')

        let mainRole = message.guild.roles.cache.find(
          role => role.name === 'Community'
        )
        let muteRole = message.guild.roles.cache.find(
          role => role.name === 'Muted'
        )

        let time = args[2]
        if (!time) {
          return message.reply('Time arg is missing')
        }
        person.roles.remove(mainRole)
        person.roles.add(muteRole)
        const date = new Date()
        const log = message.guild.channels.cache.find(
          channel => channel.name === 'bot-log'
        )
        const EmbedLogMute = new Discord.MessageEmbed()
          .setTitle('User Muted')
          .setDescription(`${person} was struck by the mute-hammer!`)
          .addField('User Muted:', person)
          .addField('Mod Responsible:', `@${message.member.user.tag}`)
          .addField('Time Muted:', ms(ms(time, true)))
          .setFooter(date)
        log.send(EmbedLogMute)
        message.channel.send(
          `!dm @${person} You have been muted for ${ms(ms(time, true))}`
        )

        setTimeout(() => {
          person.roles.add(mainRole)
          person.roles.remove(muteRole)
          message.channel.send(`@${person.user.tag} now has been unmuted!`)
          const auto = new Discord.MessageEmbed()
            .setTitle('User Unmuted')
            .setDescription(`${person} was struck by the un-mute-hammer!`)
            .addField('User Unmuted:', person)
            .addField('Mod Responsible:', `This case was auto-resolved`)
            .setFooter(date)
          log.send(auto)
        }, ms(time))
      }
      break
    case 'kick':
      if (
        !message.member.roles.cache.find(r => r.name == '+') ||
        !message.member.roles.cache.find(r => r.name == 'Moderator')
      ) {
        return message.channel.send(
          'You do not have the required role to run this command!'
        )
      } else {
        if (!args[1]) message.channel.send('Invalid Args')
        const user = message.mentions.users.first()
        if (user) {
          const member = message.guild.member(user)
          if (member) {
            message.channel.send(
              `!dm ${user} You have been kicked!`
            )
            member
              .kick(`You were kicked from ${message.guild.name}`)
              .then(() => message.reply(`Kicked ${user.tag}`))
              .then(() => {
                const date = new Date()
                const logChannelKick = message.guild.channels.cache.find(
                  r => r.name === 'bot-log'
                )
                const EmbedLogKick = new Discord.MessageEmbed()
                  .setTitle('User Kicked')
                  .setDescription(`${member} was struck by the kick-hammer!`)
                  .addField('User Kicked:', member)
                  .addField('Mod Responsible:', `@${message.member.user.tag}`)
                  .setFooter(date)
                logChannelKick.send(EmbedLogKick)
              })
          } else {
            message.reply('That user isnt in the server')
          }
        } else {
          message.reply('That user isnt in the server')
        }
      }
      break
    case 'list':
      const embedList = new Discord.MessageEmbed()
        .setTitle('Command List')
        .addField('Prefix:', '!')
        .addField(
          'Admin Commands:',
          'unmute, ban, kick, mute, clear, warn, poll, dm, addRole, removeRole, newText, newVoice'
        )
        .addField(
          'Public commands:',
          'info discord, getBot, me, help, && server-self-roles'
        )
        .addField('Role Required to access Admin commands:', 'Moderator')
        .setFooter('Came to you by @glaukiol1 on GitHub!')
        .setColor(0xf1c40f)
      message.channel.send(embedList)
      break
    case 'addRole':
      if (
        !message.member.roles.cache.find(r => r.name == '+') ||
        !message.member.roles.cache.find(r => r.name == 'Moderator')
      ) {
        return message.channel.send(
          `You do not have the required role to run this command! (ONLY: ${data.server.leadingTeam.map((i) => {
            return data.server.leadingTeam[i];
          })}`
        )
      } else {
        if (!args[2]) return message.channel.send('Invalid Args')
        let targetP = message.guild.member(
          message.mentions.users.first() ||
            message.guild.members.cache.get(args[1])
        )
        let roleA = message.guild.roles.cache.find(r => r.name === args[2])
        if (!roleA)
          return message.channel.send(`I cant find the role: ${roleA}`)
        if (!targetP) return message.channel.send(`I cant find the person!`)
        targetP.roles.add(roleA)
      }
      break
    case 'removeRole':
      if (
        !message.member.roles.cache.find(r => r.name == '+') ||
        !message.member.roles.cache.find(r => r.name == 'Moderator')
      ) {
        return message.channel.send(
          'You do not have the required role to run this command!'
        )
      } else {
        if (!args[2]) return message.channel.send('Invalid Args')
        let targetP = message.guild.member(
          message.mentions.users.first() ||
            message.guild.members.cache.get(args[1])
        )
        let roleA = message.guild.roles.cache.find(r => r.name === args[2])
        if (!roleA)
          return message.channel.send(`I cant find the role: ${roleA}`)
        if (!targetP) return message.channel.send(`I cant find the person!`)
        targetP.roles.remove(roleA)
      }
  }
  }
  
})

bot.on('message', message => {
  let args = message.content.substring(prefix.length).split(' ')
  if (message.content[0]===prefix) {
  switch (args[0]) {
    case 'unmute':
      if (
        !message.member.roles.cache.find(r => r.name == '+') ||
        !message.member.roles.cache.find(r => r.name === 'Moderator')
      ) {
        return message.channel.send(
          'You do not have the required role to run this command!'
        )
      } else {
        let person = message.guild.member(
          message.mentions.users.first() ||
            message.guild.members.cache.get(args[1])
        )
        if (!person) return message.reply('I cant find that member!')

        let mainRole = message.guild.roles.cache.find(
          role => role.name === 'Community'
        )
        let muteRole = message.guild.roles.cache.find(
          role => role.name === 'Muted'
        )

        person.roles.remove(muteRole)
        person.roles.add(mainRole)
        const logChannel = message.guild.channels.cache.find(
          channel => channel.name === 'bot-log'
        )
        const date = new Date()
        const EmbedLogUnMute = new Discord.MessageEmbed()
          .setTitle('User Unmuted')
          .setDescription(`${person} was struck by the un-mute-hammer!`)
          .addField('User Unmuted:', person)
          .addField('Mod Responsible:', `@${message.member.user.tag}`)
          .setFooter(date)
        logChannel.send(EmbedLogUnMute)

        message.channel.send(`@${person.user.tag} got unmuted!`)
      }
      break
    case 'poll':
      if (
        !message.member.roles.cache.find(r => r.name == '+') ||
        !message.member.roles.cache.find(r => r.name === 'Moderator')
      ) {
        return message.channel.send(
          'You do not have the required role to run this command!'
        )
      } else {
        const Embed = new Discord.MessageEmbed()
          .setColor(0xffc300)
          .setTitle('Initiate Poll')
          .setDescription('!poll to initiate a simple yes or no poll')

        if (!args[1]) {
          message.channel.send(Embed)
          break
        }
        let msgArgs = args.slice(1).join(' ')
        message.channel.send(`**${msgArgs}**`).then(messageReaction => {
          messageReaction.react('👍')
          messageReaction.react('👎')
        })
      }
      message.delete()
      break
    case 'warn':
      if (
        !message.member.roles.cache.find(r => r.name == '+') ||
        !message.member.roles.cache.find(r => r.name === 'Moderator')
      ) {
        return message.channel.send(
          'You do not have the required role to run this command!'
        )
      } else {
        let memberWarn = message.mentions.users.first()
        if (!memberWarn) {
          message.channel.send('Invalid Args')
        } else {
          message.channel.send(`!mute ${memberWarn} 5m`)
          message.channel.send(
            `!dm ${memberWarn} You have been warned in the Sweats server`
          )
        }
      }
      break
    case 'eu':
      let euRole = message.guild.roles.cache.find(r => r.name === 'EU')
      let targetMa = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[1])
      )
      if (!targetMa) return message.channel.send('Invalid Args')
      targetMa.roles.add(euRole)
      break
    case 'nae':
      let naeRole = message.guild.roles.cache.find(r => r.name === 'NAE')
      let targetMs = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[1])
      )
      if (!targetMs) return message.channel.send('Invalid Args')
      targetMs.roles.add(naeRole)
      break
    case 'oce':
      let oceRole = message.guild.roles.cache.find(r => r.name === 'OCE')
      let targetMd = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[1])
      )
      if (!targetMd) return message.channel.send('Invalid Args')
      targetMd.roles.add(oceRole)
      break
    case 'middleEast':
      let mRole = message.guild.roles.cache.find(r => r.name === 'middleEast')
      let targetMf = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[1])
      )
      if (!targetMf) return message.channel.send('Invalid Args')
      targetMf.roles.add(mRole)
      break
    case 'naw':
      let nawRole = message.guild.roles.cache.find(r => r.name === 'NAW')
      let targetMg = message.guild.member(
        message.mentions.users.first() ||
          message.guild.members.cache.get(args[1])
      )
      if (!targetMg) return message.channel.send('Invalid Args')
      targetMg.roles.add(nawRole)
      break
    case 'newText':
      message.guild.channels
        .create(args[1], { type: 'text' })
        .then(() => message.channel.send('Channel Created!'))
      break
    case 'newVoice':
      message.guild.channels
        .create(args[1], { type: 'voice' })
        .then(() => message.channel.send(`Voice channel created!`))
  }
  }
  
})

//bot.on('message', message => {
//   const logChannelF = message.guild.channels.cache.find(
//     r => r.name === 'bot-log'
//   )
//   if (
//     message.member.roles.cache.find(r => r.name == '+') ||
//     message.member.roles.cache.find(r => r.name === 'Moderator')
//   ) {
//     return message.channel.send('You are not affected by sending links! NICE')
//   } else {
//     if (message.content.includes('https://')) {
//       message.delete()
//       return message.channel.send('Links are not allowed here!')
//     }
//     if (message.content.includes('http://')) {
//       message.delete()
//       return message.channel.send('Links are not allowed here!')
//     }
//     if (message.content.includes('www.')) {
//       message.delete()
//       return message.channel.send('Links are not allowed here!')
//     }
//     if (message.content.includes('.com')) {
//       message.delete()
//       return message.channel.send('Links are not allowed here!')
//     }
//   }
// })

bot.on('guildMemberAdd', async member => {
  const greetChannel = member.guild.channels.cache.find(
    channel => channel.name === 'greetings'
  )
  greetChannel.send(
    `Welcome to our server, ${member}, please read all of the rules!`
  )
  greetChannel.send(
    `!dm Hello, ${member} we are trying to make a big Fortnite server. If u want to know more go to #about-us and #anouncements. Thanks`
  )
  let mainRole = member.guild.roles.cache.find(
    role => role.name === 'Community'
  )
  member.roles.add(mainRole)
  const totalMembers = member.guild.memberCount
  const totalBefore = totalMembers - 1
  const memberCount = member.guild.channels.cache.find(
    r => r.name === `member-count-${totalBefore}`
  )
  console.log(totalMembers)
  memberCount.setName(`member-count: ${totalMembers}`)
})

bot.on('guildMemberRemove', member => {
  const greetChannel = member.guild.channels.cache.find(
    channel => channel.name === 'greetings'
  )
  greetChannel.send(`Sadly, ${member} left us..... RIP`)
  bot.on('message', message => {
    if (message.content === `Sadly, ${member} left us..... RIP`) {
      const totalMembers = message.guild.memberCount
      const totalBefore = totalMembers + 1
      const memberCount = member.guild.channels.cache.find(
        r => r.name === `member-count-${totalBefore}`
      )
      console.log(totalMembers)
      memberCount.setName(`member-count: ${totalMembers}`)
    }
  })
})

bot.on('ready', () => {
  console.log('Bot is online!')
  bot.user.setActivity('Moderating, listening for '+prefix)
})

bot.login(token)
