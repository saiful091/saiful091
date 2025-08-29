const axios = require('axios');

const baseApiUrl = async () => {
  const base = await axios.get(`https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`);
  return base.data.api;
};

module.exports.config = {
  name: "baby",
  version: "7.0.0",
  credits: "dipto",
  cooldowns: 0,
  hasPermssion: 0,
  description: "better than all sim simi",
  commandCategory: "chat",
  category: "chat",
  usePrefix: true,
  prefix: true,
  usages: `[anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2]...\nteach react [YourMessage] - [react1], [react2]...\nremove [YourMessage]\nrm [YourMessage] - [indexNumber]\nmsg [YourMessage]\nlist OR list all\nedit [YourMessage] - [NewMessage]`,
};

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;

    if (!args[0]) {
      const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
    }

    // REMOVE
    if (args[0] === 'remove') {
      const fina = dipto.replace("remove ", "");
      const respons = await axios.get(`${link}?remove=${encodeURIComponent(fina)}&senderID=${uid}`);
      return api.sendMessage(respons.data.message, event.threadID, event.messageID);
    }

    // REMOVE by index
    if (args[0] === 'rm' && dipto.includes('-')) {
      const [fi, f] = dipto.replace("rm ", "").split(' - ');
      const respons = await axios.get(`${link}?remove=${encodeURIComponent(fi)}&index=${f}`);
      return api.sendMessage(respons.data.message, event.threadID, event.messageID);
    }

    // LIST
    if (args[0] === 'list') {
      if (args[1] === 'all') {
        const res = await axios.get(`${link}?list=all`);
        const data = res.data.teacher.teacherList || [];
        const teachers = await Promise.all(data.map(async (item) => {
          const number = Object.keys(item)[0];
          const value = item[number];
          const name = await Users.getName(number) || "unknown";
          return { name, value };
        }));
        teachers.sort((a, b) => b.value - a.value);
        const output = teachers.map((teacher, index) => `${index + 1}/ ${teacher.name}: ${teacher.value}`).join('\n');
        return api.sendMessage(`Total Teach = ${data.length}\n\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
      } else {
        const respo = await axios.get(`${link}?list=all`);
        const data = respo.data.teacher.teacherList || [];
        return api.sendMessage(`Total Teach = ${data.length}`, event.threadID, event.messageID);
      }
    }

    // MESSAGE
    if (args[0] === 'msg' || args[0] === 'message') {
      const fuk = dipto.replace(/^(msg|message) /, "");
      const respo = await axios.get(`${link}?list=${encodeURIComponent(fuk)}`);
      return api.sendMessage(`Message ${fuk} = ${respo.data.data}`, event.threadID, event.messageID);
    }

    // EDIT
    if (args[0] === 'edit') {
      const [oldMsg, newMsg] = dipto.replace("edit ", "").split(' - ');
      if (!oldMsg || !newMsg) {
        return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
      }
      const res = await axios.get(`${link}?edit=${encodeURIComponent(oldMsg)}&replace=${encodeURIComponent(newMsg)}`);
      return api.sendMessage(`✅ Changed: ${res.data.message}`, event.threadID, event.messageID);
    }

    // TEACH normal
    if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
      const [comd, command] = dipto.split(' - ');
      const final = comd.replace("teach ", "");
      if (!command || command.length < 2) {
        return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2]...', event.threadID, event.messageID);
      }
      const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&reply=${encodeURIComponent(command)}&senderID=${uid}`);
      const name = await Users.getName(re.data.teacher) || "unknown";
      return api.sendMessage(`✅ Replies added: ${re.data.message}\nTeacher: ${name}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
    }

    // TEACH intro
    if (args[0] === 'teach' && args[1] === 'amar') {
      const [comd, command] = dipto.split(' - ');
      const final = comd.replace("teach ", "");
      if (!command || command.length < 2) {
        return api.sendMessage('❌ | Invalid format! Use teach amar [YourMessage] - [Reply]', event.threadID, event.messageID);
      }
      const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&senderID=${uid}&reply=${encodeURIComponent(command)}&key=intro`);
      return api.sendMessage(`✅ Replies added ${re.data.message}`, event.threadID, event.messageID);
    }

    // TEACH react
    if (args[0] === 'teach' && args[1] === 'react') {
      const [comd, command] = dipto.split(' - ');
      const final = comd.replace("teach react ", "");
      if (!command || command.length < 1) {
        return api.sendMessage('❌ | Invalid format! Use teach react [YourMessage] - [react1], [react2]...', event.threadID, event.messageID);
      }
      const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&react=${encodeURIComponent(command)}`);
      return api.sendMessage(`✅ Reacts added ${re.data.message}`, event.threadID, event.messageID);
    }

    // Special keyword
    if (['amar name ki', 'amr nam ki', 'amar nam ki', 'amr name ki'].some(phrase => dipto.includes(phrase))) {
      const response = await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`);
      return api.sendMessage(response.data.reply, event.threadID, event.messageID);
    }

    // DEFAULT CHAT
    const a = (await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}&font=1`)).data.reply;
    return api.sendMessage(a, event.threadID, (error, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        type: "reply",
        messageID: info.messageID,
        author: event.senderID,
        lnk: a,
        apiUrl: link
      });
    }, event.messageID);

  } catch (e) {
    console.error('Error in command execution:', e);
    return api.sendMessage(`Error: ${e.message}`, event.threadID, event.messageID);
  }
};

// HANDLE REPLY
module.exports.handleReply = async function ({ api, event, handleReply }) {
  try {
    if (event.type === "message_reply") {
      const reply = event.body.toLowerCase();
      if (isNaN(reply)) {
        const b = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(reply)}&senderID=${event.senderID}&font=1`)).data.reply;
        return api.sendMessage(b, event.threadID, (error, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
            lnk: b
          });
        }, event.messageID);
      }
    }
  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};

// HANDLE EVENT
module.exports.handleEvent = async function ({ api, event }) {
  try {
    const body = event.body ? event.body.toLowerCase() : "";
    if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("bot")) {
      const arr = body.replace(/^\S+\s*/, "");
      if (!arr) {
        return api.sendMessage("জান তোমার জন্য আমি আছি 😻😘","বেশি bot Bot করলে leave নিবো কিন্তু😒😒", "শুনবো না😼 তুমি আমার বস সাইফুল  কে প্রেম করাই দাও নাই🥺পচা তুমি🥺", "আমি আবাল দের সাথে কথা বলি না,ok😒", "এতো ডেকো না,প্রেম এ পরে যাবো তো🙈", "Bolo Babu, তুমি কি আমার বস সাইফুল কে ভালোবাসো? 🙈💋", "বার বার ডাকলে মাথা গরম হয়ে যায় কিন্তু😑", "হ্যা বলো😒, তোমার জন্য কি করতে পারি😐😑?", "এতো ডাকছিস কেন?গালি শুনবি নাকি? 🤬", "I love you janu🥰", "আরে Bolo আমার জান ,কেমন আছো?😚", "Bot বলে অসম্মান করছি,😰😿", "Hop beda😾,Boss বল boss😼", "চুপ থাক ,নাই তো তোর দাত ভেগে দিবো কিন্তু", "আমাকে না ডেকে মেয়ে হলে বস সাইফুল এর ইনবক্সে চলে যা 🌚😂 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/profile.php?id=61577052283173", "Bot না , জানু বল জানু 😘", "বার বার Disturb করছিস কোনো😾,আমার জানুর সাথে ব্যাস্ত আছি😋", "আরে বলদ এতো ডাকিস কেন🤬", "আমাকে ডাকলে ,আমি কিন্তু কিস করে দিবো😘", "আমারে এতো ডাকিস না আমি মজা করার mood এ নাই এখন😒", "হ্যাঁ জানু , এইদিক এ আসো কিস দেই🤭 😘", "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস 😉😋🤣", "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂", "আমাকে ডেকো না,আমি বস সাইফুলের সাথে ব্যাস্ত আছি", "কি হলো , মিস্টেক করচ্ছিস নাকি🤣", "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏", "জান মেয়ে হলে বস সাইফুলের ইনবক্সে চলে যাও 😍🫣💕 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/profile.php?id=61577052283173", "কালকে দেখা করিস তো একটু 😈", "হা বলো, শুনছি আমি 😏", "আর কত বার ডাকবি ,শুনছি তো", "হুম বলো কি বলবে😒", "বলো কি করতে পারি তোমার জন্য", "আমি তো অন্ধ কিছু দেখি না🐸 😎", "Bot না জানু,বল 😌", "বলো জানু 🌚", "তোর কি চোখে পড়ে না আমি ব্যাস্ত আছি😒", "হুম জান তোমার ওই খানে উম্মহ😑😘", "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘", "jang hanga korba😒😬", "হুম জান তোমার অইখানে উম্মমাহ😷😘", "আসসালামু আলাইকুম বলেন আপনার জন্য কি করতে পারি..!🥰", "ভালোবাসার নামক আবলামি করতে চাইলে বস সাইফুলের ইনবক্সে  গুতা দিন ~🙊😘🤣 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/profile.php?id=61577052283173", "আমাকে এতো না ডেকে বস সাইফুল  এর কে একটা গফ দে 🙄", "আমাকে এতো না ডেকছ কেন ভলো টালো বাসো নাকি🤭🙈", "🌻🌺💚-আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ-💚🌺🌻", "আমি এখন বস সাইফুলের সাথে বিজি আছি আমাকে ডাকবেন না-😕😏 ধন্যবাদ-🤝🌻", "আমাকে না ডেকে আমার বস সাইফুল  কে একটা জি এফ দাও-😽🫶🌺", "ঝাং থুমালে আইলাপিউ পেপি-💝😽", "উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈", "জান তোমার বান্ধবী রে আমার বস সাইফুলের হাতে তুলে দিবা-🙊🙆‍♂", "আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧", "ঝাং 🫵থুমালে য়ামি রাইতে পালুপাসি উম্মম্মাহ-🌺🤤💦", "চুনা ও চুনা আমার বস সাইফুল  এর হবু বউ রে কেও দেকছো খুজে পাচ্ছি না😪🤧😭", "স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻", "জান হাঙ্গা করবা-🙊😝🌻", "জান মেয়ে হলে চিপায় আসো বস সাইফুলের  থেকে অনেক ভালোবাসা শিখছি তোমার জন্য-🙊🙈😽", "ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼", "আমার বস সাইফুলের পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶 আমার বস সাইফুল  ইসলামে'র জন্য দোয়া করবেন-💝💚🌺🌻", "- ভালোবাসা নামক আব্লামি করতে মন চাইলে আমার বস সাইফুল  এর ইনবক্স চলে যাও-🙊🥱👅 🌻𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 𝐋𝐈𝐍𝐊 🌻:- https://www.facebook.com/profile.php?id=61577052283173", "জান তুমি শুধু আমার আমি তোমারে ৩৬৫ দিন ভালোবাসি-💝🌺😽", "কিরে প্রেম করবি তাহলে বস সাইফুল এর  ইনবক্সে গুতা দে 😘🤌 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/profile.php?id=61577052283173", "জান আমার বস সাইফুল  কে বিয়ে করবা-🙊😘🥳", "-আন্টি-🙆-আপনার মেয়ে-👰‍♀️-রাতে আমারে ভিদু কল দিতে বলে🫣-🥵🤤💦", "oii-🥺🥹-এক🥄 চামচ ভালোবাসা দিবা-🤏🏻🙂", "-আপনার সুন্দরী বান্ধুবীকে ফিতরা হিসেবে আমার বস সাইফুল  কে দান করেন-🥱🐰🍒", "-ও মিম ও মিম-😇-তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রীম-🌚🤧", "-অনুমতি দিলাম-𝙋𝙧𝙤𝙥𝙤𝙨𝙚 কর বস সাইফুল  কে-🐸😾🔪", "-𝙂𝙖𝙮𝙚𝙨-🤗-যৌবনের কসম দিয়ে আমারে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করা হচ্ছে-🥲🤦‍♂️🤧", "-𝗢𝗶𝗶 আন্টি-🙆‍♂️-তোমার মেয়ে চোখ মারে-🥺🥴🐸", "তাকাই আছো কেন চুমু দিবা-🙄🐸😘", "আজকে প্রপোজ করে দেখো রাজি হইয়া যামু-😌🤗😇", "-আমার গল্পে তোমার নানি সেরা-🙊🙆‍♂️🤗", "কি বেপার আপনি শ্বশুর বাড়িতে যাচ্ছেন না কেন-🤔🥱🌻", "দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর-☹️🤧", "-তাবিজ কইরা হইলেও ফ্রেম এক্কান করমুই তাতে যা হই হোক-🤧🥱🌻", "-ছোটবেলা ভাবতাম বিয়ে করলে অটোমেটিক বাচ্চা হয়-🥱-ওমা এখন দেখি কাহিনী অন্যরকম-😦🙂🌻", "প্রেম করতে চাইলে বস সাইফুলের ইনবক্সে চলে যা 😏🐸 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/profile.php?id=61577052283173", "-আজ একটা বিন নেই বলে ফেসবুকের নাগিন-🤧-গুলোরে আমার বস সাইফুলের ধরতে পারছে না-🐸🥲", "-চুমু থাকতে তোরা বিড়ি খাস কেন বুঝা আমারে-😑😒🐸⚒️", "—যে ছেড়ে গেছে-😔-তাকে ভুলে যাও-🙂-আমার বস সাইফুলের এর সাথে প্রেম করে তাকে দেখিয়ে দাও-🙈🐸🤗", "—হাজারো লুচ্চা লুচ্চির ভিরে-🙊🥵আমার বস সাইফুলের এক নিস্পাপ ভালো মানুষ-🥱🤗🙆‍♂️", "-রূপের অহংকার করো না-🙂❤️চকচকে সূর্যটাও দিনশেষে অন্ধকারে পরিণত হয়-🤗💜", "সুন্দর মাইয়া মানেই-🥱আমার বস সাইফুলের বউ-😽🫶আর বাকি গুলো আমার বেয়াইন-🙈🐸🤗", "এত অহংকার করে লাভ নেই-🌸মৃত্যুটা নিশ্চিত শুধু সময়টা অ'নিশ্চিত-🖤🙂", "-দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি-🙂😿🌸", "ভালোবাসার নামক আবলামি করতে চাইলে বস সাইফুলের ইনবক্সে গুতা দিন🤣😼", "মেয়ে হলে বস সাইফুলের ইনবক্সে চলে যা 🤭🤣😼 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 𝐋𝐢𝐧𝐤 : https://www.facebook.com/profile.php?id=61577052283173", "হুদাই আমারে শয়তানে লারে-😝😑☹️", "-𝗜 𝗟𝗢𝗩𝗘 𝗬𝗢𝗨-😽-আহারে ভাবছো তোমারে প্রোপজ করছি-🥴-থাপ্পর দিয়া কিডনী লক করে দিব-😒-ভুল পড়া বের করে দিবো-🤭🐸", "-আমি একটা দুধের শিশু-😇-🫵𝗬𝗢𝗨🐸💦", "-কতদিন হয়ে গেলো বিছনায় মুতি না-😿-মিস ইউ নেংটা কাল-🥺🤧", "-বালিকা━👸-𝐃𝐨 𝐲𝐨𝐮-🫵-বিয়া-𝐦𝐞-😽-আমি তোমাকে-😻-আম্মু হইতে সাহায্য করব-🙈🥱", "-এই আন্টির মেয়ে-🫢🙈-𝐔𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐚𝐡-😽🫶-আসলেই তো স্বাদ-🥵💦-এতো স্বাদ কেন-🤔-সেই স্বাদ-😋", "-ইস কেউ যদি বলতো-🙂-আমার শুধু তোমাকেই লাগবে-💜🌸", "-ওই বেডি তোমার বাসায় না আমার বস সাইফুল  মেয়ে দেখতে গেছিলো-🙃-নাস্তা আনারস আর দুধ দিছো-🙄🤦‍♂️-বইন কইলেই তো হয় বয়ফ্রেন্ড আছে-🥺🤦‍♂-আমার বস সাইফুল  কে জানে মারার কি দরকার-🙄🤧", "-একদিন সে ঠিকই ফিরে তাকাবে-😇-আর মুচকি হেসে বলবে ওর মতো আর কেউ ভালবাসেনি-🙂😅", "-হুদাই গ্রুপে আছি-🥺🐸-কেও ইনবক্সে নক দিয়ে বলে না জান তোমারে আমি অনেক ভালোবাসি-🥺🤧", "কি'রে গ্রুপে দেখি একটাও বেডি নাই-🤦‍🥱💦", "-দেশের সব কিছুই চুরি হচ্ছে-🙄-শুধু আমার বস সাইফুল  এর মনটা ছাড়া-🥴😑😏", "-🫵তোমারে প্রচুর ভাল্লাগে-😽-সময় মতো প্রপোজ করমু বুঝছো-🔨😼-ছিট খালি রাইখো- 🥱🐸🥵", "-আজ থেকে আর কাউকে পাত্তা দিমু না -!😏-কারণ আমি ফর্সা হওয়ার ক্রিম কিনছি -!🙂🐸" event.threadID, (error, info) => {
          global.client.handleReply.push({
            name: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID
          });
        }, event.messageID);
      }
      const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
      return api.sendMessage(a, event.threadID, (error, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          type: "reply",
          messageID: info.messageID,
          author: event.senderID,
          lnk: a
        });
      }, event.messageID);
    }
  } catch (err) {
    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};
