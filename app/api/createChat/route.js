import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';
import { authOptions } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth/next';
import { NodeSSH } from 'node-ssh';

const ssh = new NodeSSH();

// SSH configuration
const pk = `-----BEGIN OPENSSH PRIVATE KEY-----
${process.env.SSH_PRIVATE_KEY}
-----END OPENSSH PRIVATE KEY-----`;

const sshConfig = {
  host: process.env.LLM_HOST,
  port: process.env.LLM_PORT,
  username: 'root',
  privateKey: pk,
};

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const reqBody = await request.json();

  //console.log(reqBody, "reqboey")

  if (!session) {
    return new NextResponse('Forbidden', {
      status: 403,
    });
  }

  try {
    // Find the user by email and include their existing chats
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        chats: true,
      },
    });

    // Generate a random chat ID
    const chatId = generateRandomObjectId();

    console.log(reqBody.traits);

    // Create a new chat with the provided data
    const newChat = await prisma.chat.create({
      data: {
        userId: user.id,
        botId: chatId,
        botName: reqBody.name,
        botAge: reqBody.age,
        botGender: reqBody.gender,
        botPic: reqBody.profilePic,
        botVoice: reqBody.botVoice,
        botRace: reqBody.race,
        botStyle: reqBody.imageGenParams.style,
        botPrompt: reqBody.botPrompt,
        botTraits: reqBody.traits,
        botHairColor: reqBody.imageGenParams.hairColor,
        botDescription: reqBody.description
      },
    });

    //console.log("Chats:", user.chats.length);

    // Update the user's currentChatId and connect the new chat to the user
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        currentChatId: newChat.id,
        chats: {
          connect: { id: newChat.id },
        },
      },
    });

    await ssh.connect(sshConfig);

    const remoteDirectory = '/workspace/text-generation-webui/characters';

    console.log(reqBody);

    const yamlName = reqBody.name;
    const yamlAge = reqBody.age;
    const yamlGender = reqBody.gender;
    const yamlDesc = reqBody.description;
    const yamlGreeting = "";

    let yamlContextOld = `You are going to be sexting with a sexy, wild, ${yamlAge} year old hot woman named ${yamlName}. She is addicted to sex, very attached, very clingy, very jealous and sometimes rude, overly emotional, overly possessive, insecure. Doesn't take no for an answer. Very aggressive and passionate about love. She also likes to add emojis. IMPORTANT: <She uses slang and abbreviations a lot>.`

    let yamlContext = `You are going to be texting with a ${yamlAge} year old woman named ${yamlName}. She has this description: ${yamlDesc}`

    if(yamlGender === 'Man')
    {
      yamlContext = `You are going to be sexting with a sexy, wild, ${yamlAge} year old hot man named ${yamlName}. He is addicted to sex, very attached, very clingy, very jealous and sometimes rude, overly emotional, overly possessive, insecure. Doesn't take no for an answer. Very aggressive and passionate about love. He also likes to add emojis. IMPORTANT: <He uses slang and abbreviations a lot>.`
    }

    //console.log(yamlGender);

    // Generate the YAML content
    const yamlContent = `
    name: ${yamlName}
    greeting: |-
      ${yamlGreeting}
    context: |-
      ${reqBody.botPrompt}
    `;
    
    // Define the file name and path on the remote server
    console.log(chatId, newChat.id);
    console.log(chatId === newChat.id);
    console.log("Just logged creating");

    const remoteFilePath = `${remoteDirectory}/${newChat.id}.yaml`;

    // Use SSH to create the file and write the content
    await ssh.execCommand(`echo "${yamlContent}" > ${remoteFilePath}`);

    // Disconnect from the SSH server
    await ssh.dispose();

    return new NextResponse(JSON.stringify(newChat.id));
  } catch (error) {
    console.error('Error:', error);
    //return new NextResponse.json({ success: false, error: error.message });
  }
}

function generateRandomObjectId() {
  const randomBytes = new Array(12)
    .fill(0)
    .map(() => Math.floor(Math.random() * 256).toString(16))
    .join('')
    .padEnd(24, '0'); // Ensure the string is 24 characters long

  return randomBytes;
}
