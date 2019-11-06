import { clientServerMessageFailHandler, clientServerMessageHandler } from './web-sockets/client-message-handlers';
import { createClientSocketConnection } from './web-sockets/create-client-socket-connection';
import { mapBoth } from 'fp-ts-helpers';
import { CLIENT_MESSAGES } from '@nick-kelly/microservices-prototype-messages';

const ELEMENTS_DETAILS = {
  ROOT: { tag: 'div', id: 'root' },
  UL_USER_LIST: { tag: 'ul', id: 'ul-user-list' },
  BTN_ADD_USER: { tag: 'button', id: 'btn-add-user' },
  INPT_NEW_USER_NAME: { tag: 'input', id: 'inpt-new-user-name' },
  INPT_NEW_USER_PASSWORD: { tag: 'input', id: 'inpt-new-user-password' },
  BTN_PING: { tag: 'button', id: 'btn-ping' },
  UL_SERVER_PONGS: { tag: 'ul', id: 'ul-server-pongs' },
  UL_SERVER_PINGS: { tag: 'ul', id: 'ul-server-pings' },
  UL_CLIENT_PONGS: { tag: 'ul', id: 'ul-client-pongs' },
  UL_CLIENT_MESSAGES: { tag: 'ul', id: 'ul-client-messages' },
  UL_MESSAGE_LOG: { tag: 'ul', id: 'ul-message-log' },
} as const;

// console.log(io);

const root = document.getElementsByTagName(ELEMENTS_DETAILS.ROOT.tag).namedItem(ELEMENTS_DETAILS.ROOT.id);
const ulUserList = document.getElementsByTagName(ELEMENTS_DETAILS.UL_USER_LIST.tag).namedItem(ELEMENTS_DETAILS.UL_USER_LIST.id); //'ul-user-list');
const btnAddUser = document.getElementsByTagName(ELEMENTS_DETAILS.BTN_ADD_USER.tag).namedItem(ELEMENTS_DETAILS.BTN_ADD_USER.id); //'ul-user-list');
const inptUserName = document.getElementsByTagName(ELEMENTS_DETAILS.INPT_NEW_USER_NAME.tag).namedItem(ELEMENTS_DETAILS.INPT_NEW_USER_NAME.id); //'ul-user-list');
const inptUserPassword = document.getElementsByTagName(ELEMENTS_DETAILS.INPT_NEW_USER_PASSWORD.tag).namedItem(ELEMENTS_DETAILS.INPT_NEW_USER_PASSWORD.id); //'ul-user-list');
const btnPing = document.getElementsByTagName(ELEMENTS_DETAILS.BTN_PING.tag).namedItem(ELEMENTS_DETAILS.BTN_PING.id); //'ul-user-list');
const ulServerPongs = document.getElementsByTagName(ELEMENTS_DETAILS.UL_SERVER_PINGS.tag).namedItem(ELEMENTS_DETAILS.UL_SERVER_PINGS.id); //'ul-user-list');
const ulServerPings = document.getElementsByTagName(ELEMENTS_DETAILS.UL_SERVER_PONGS.tag).namedItem(ELEMENTS_DETAILS.UL_SERVER_PONGS.id); //'ul-user-list');
const ulClientPings = document.getElementsByTagName(ELEMENTS_DETAILS.UL_CLIENT_PONGS.tag).namedItem(ELEMENTS_DETAILS.UL_CLIENT_PONGS.id); //'ul-user-list');
const ulMessageLog = document.getElementsByTagName(ELEMENTS_DETAILS.UL_MESSAGE_LOG.tag).namedItem(ELEMENTS_DETAILS.UL_MESSAGE_LOG.id); //'ul-user-list');

if (!root) throw new ReferenceError(`Unable to find element ${ELEMENTS_DETAILS.ROOT.tag}::${ELEMENTS_DETAILS.ROOT.id}`);
if (!ulUserList) throw new ReferenceError(`Unable to find element ${ELEMENTS_DETAILS.UL_USER_LIST.tag}::${ELEMENTS_DETAILS.UL_USER_LIST.id}`);
if (!btnAddUser) throw new ReferenceError(`Unable to find element ${ELEMENTS_DETAILS.BTN_ADD_USER.tag}::${ELEMENTS_DETAILS.BTN_ADD_USER.id}`);
if (!inptUserName) throw new ReferenceError(`Unable to find element ${ELEMENTS_DETAILS.INPT_NEW_USER_NAME.tag}::${ELEMENTS_DETAILS.INPT_NEW_USER_NAME.id}`);
if (!inptUserPassword) throw new ReferenceError(`Unable to find element ${ELEMENTS_DETAILS.INPT_NEW_USER_PASSWORD.tag}::${ELEMENTS_DETAILS.INPT_NEW_USER_PASSWORD.id}`);
if (!btnPing) throw new ReferenceError(`Unable to find element ${ELEMENTS_DETAILS.BTN_PING.tag}::${ELEMENTS_DETAILS.BTN_PING.id}`);
if (!ulServerPongs) throw new ReferenceError(`Unable to find element ${ELEMENTS_DETAILS.UL_SERVER_PINGS.tag}::${ELEMENTS_DETAILS.UL_SERVER_PINGS.id}`);
if (!ulServerPings) throw new ReferenceError(`Unable to find element ${ELEMENTS_DETAILS.UL_SERVER_PONGS.tag}::${ELEMENTS_DETAILS.UL_SERVER_PONGS.id}`);
if (!ulClientPings) throw new ReferenceError(`Unable to find element ${ELEMENTS_DETAILS.UL_CLIENT_PONGS.tag}::${ELEMENTS_DETAILS.UL_CLIENT_PONGS.id}`);
if (!ulMessageLog) throw new ReferenceError(`Unable to find element ${ELEMENTS_DETAILS.UL_MESSAGE_LOG.tag}::${ELEMENTS_DETAILS.UL_MESSAGE_LOG.id}`);

export const ELEMENTS = {
  root,
  ulUserList,
  btnAddUser,
  inptUserName,
  inptUserPassword,
  btnPing,
  ulServerPongs,
  ulServerPings,
  ulClientPings,
  ulMessageLog,
} as const;

const conncetion = createClientSocketConnection('localhost:3000').connect();
const { server } = conncetion;

const unmodifiedSend = server.send.bind(server);
server.send =  function proxySend(...args: Parameters<typeof unmodifiedSend>) {
  console.log(`__send message__ (${args[0].type})`);
  const [ message ] = args;

  const log = document.createElement('li');
  let logContent = `[CLIENT] [${message.type}]`;

  switch(message.type) {
    case CLIENT_MESSAGES.TYPE.CREATE_ORDER: {
      logContent += [
        `\n\tname: ${message.payload.name}`,
        `\n\tamount: ${message.payload.amount}`,
      ].join('');
      break;
    }

    case CLIENT_MESSAGES.TYPE.DELETE_ORDER: {
      logContent += [
        `\n\tid: ${message.payload.id}`,
      ].join('');
      break;
    }

    case CLIENT_MESSAGES.TYPE.PING: {
      logContent += [].join('');
      break;
    }

    case CLIENT_MESSAGES.TYPE.PONG: {
      logContent += [].join('');
      break;
    }

    case CLIENT_MESSAGES.TYPE.UPDATE_ORDER: {
      logContent += [
        `\n\tid: ${message.payload.id}`,
        `\n\tname: ${message.payload.name}`,
        `\n\tamount: ${message.payload.amount}`,
      ].join('');
      break;
    }

    default: {
      logContent += `\n\t[UNHANDLED_MESSAGE_TYPE] "${(message as any).type}"`;
      break;
    }
  }

  log.textContent = logContent;
  ELEMENTS.ulMessageLog.appendChild(log);
  return unmodifiedSend(...args);
};


server.on(mapBoth(clientServerMessageFailHandler(server), clientServerMessageHandler(server)));
