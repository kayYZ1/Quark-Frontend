import React, { useState } from 'react';
import { Input, Button, Card, Layout } from 'antd';
import { SmileOutlined, SendOutlined } from '@ant-design/icons';
import EmojiPicker from 'emoji-picker-react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from "../styles/Components/Chat.module.css"

interface Message {
	text: string;
	timestamp: string;
	sender: string | undefined;
}

const getCurrTime = () => {
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	return `${hours}:${minutes}`;
}

const Chat: React.FC = () => {
	const params = useParams();
	const { userState } = useSelector((state: any) => state.auth)

	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [messages, setMessages] = useState<Message[]>
		([{ text: `Hello, ${userState.user.firstName}`, timestamp: getCurrTime(), sender: params.username }]);
	const [messageInput, setMessageInput] = useState('');

	const handleEmojiClick = () => {
		setShowEmojiPicker(!showEmojiPicker);
	};

	const handleEmoji = (emojiObject: any) => {
		setMessageInput(messageInput + emojiObject.emoji);
	};

	const handleSend = () => {
		if (messageInput.trim() !== '') {
			const newMessage: Message = {
				text: messageInput,
				timestamp: getCurrTime(),
				sender: `${userState.user.firstName} ${userState.user.lastName}`,
			};
			setMessages([...messages, newMessage]);
			setMessageInput('');
		}
	};

	return (
		<Card className={styles.chat_main}>
			<div style={{ background: '#fff', color: 'black', height: '85vh', overflowY: 'scroll' }}>
				{messages.map((message, index) => (
					<div key={index} style={{ marginLeft: 5, marginRight: 6 }}>
						<div
							style={{
								display: 'block',
								wordWrap: 'break-word',
								fontSize: 20,
							}}
						>
							<span style={{ fontSize: 10, color: 'gray' }}>{message.sender}</span>
							<div
								style={{
									backgroundColor: message.sender === params.username ? '#0084ff' : '#f0f0f0',
									color: message.sender === params.username ? 'white' : 'black',
									borderRadius: 10,
									padding: 10,
								}}
							>
								<p style={{ margin: 0 }}>{message.text}</p>
								<span style={{ fontSize: 10 }}>{message.timestamp}</span>
							</div>
						</div>
					</div>
				))}
			</div>
			<div
				className={styles.chat_input}
				style={{
					background: '#fff',
					height: '64px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '20px',

				}}
			>
				<Input
					type="text"
					placeholder={`Type a message to ${params.username}`}
					style={{
						padding: '15px',
						borderRadius: '4px',
						border: 'solid 1px #d9d9d9',
						background: '#fff',
						color: '#fff',
						fontSize: '16px',

					}}

					value={messageInput}
					onChange={(e) => setMessageInput(e.target.value)}
					onPressEnter={handleSend}
					suffix={
						<>
							<Button onClick={handleEmojiClick}>
								<SmileOutlined />
							</Button>
							{showEmojiPicker ? (
								<div className="emoji-picker-upwards">
									<EmojiPicker onEmojiClick={handleEmoji} width='900' />
								</div>
							) : null}
							<Button onClick={handleSend}>
								<SendOutlined className="site-form-item-icon" />
							</Button>
						</>
					}
				/>
			</div>
		</Card>
	);
};

export default Chat;
