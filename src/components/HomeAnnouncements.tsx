import React, { useState, useEffect } from 'react';
import { Card, List, Avatar, Form, Input, Button, Modal, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';

import { FormatDate } from '../shared/functions';

import styles from "../styles/Pages/UserSearch.module.css";
import { addAnnouncement, setAnnouncements } from '../app/slices/announcement.slice';
import { useAddAnnouncementEndpointMutation, useGetAnnouncementsEndpointMutation } from '../app/slices/auth.api.slice';

interface Announcement {
	title: string;
	content: string;
	email: string
	time: string;
}

export interface AnnouncementResponse {
	title: string
	content: string,
	time: string,
	userFirstName: string,
	userLastName: string,
	userPictureUrl: string
}

const Announcements: React.FC = () => {
	const [form] = Form.useForm();
	const [showModal, setShowModal] = useState(false);

	const dispatch = useDispatch();

	const [AddAnnouncementEndpoint, { isError }] = useAddAnnouncementEndpointMutation(); // Error alert/message if adding fails
	const [GetAnnouncementEndpoint, { isLoading }] = useGetAnnouncementsEndpointMutation(); //Skeleton if the data is loading

	useEffect(() => {
		const fetchAnnouncements = async () => {
			try {
				const response = await GetAnnouncementEndpoint(undefined).unwrap();
				console.log(response);
				dispatch(setAnnouncements(response));
			} catch (error) {
				console.error(error)
			}
		}
		fetchAnnouncements();
	}, [])

	const { announcements } = useSelector((state: any) => state.announcement);
	const { userState } = useSelector((state: any) => state.auth);
	const { user } = userState;

	const handleAddAnnouncement = () => {
		form.validateFields().then(async (values) => {
			values["date"] = FormatDate(values.date); // Change the default DatePicker format
			const newAnnouncement: Announcement = {
				title: values.title,
				content: values.content,
				time: values.date.toString(),
				email: user.email
			};

			const response = await AddAnnouncementEndpoint(newAnnouncement).unwrap();
			console.log(response);
			dispatch(addAnnouncement(response));
			form.resetFields();
			setShowModal(false);
		});
	};

	return (
		<Card className={styles.user_search_container} style={{ background: '#FFFFFF', padding: '24px', minHeight: '360px' }}>
			<Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => setShowModal(true)} style={{ position: 'fixed', bottom: '24px', right: '24px' }} />
			<Modal
				title="Add Announcement"
				visible={showModal}
				onCancel={() => setShowModal(false)}
				onOk={handleAddAnnouncement}
			>
				<Form form={form}>
					<Form.Item name="title" rules={[{ required: true, message: 'Please enter the title' }]}>
						<Input placeholder="Title" />
					</Form.Item>
					<Form.Item name="content" rules={[{ required: true, message: 'Please enter the content' }]}>
						<Input.TextArea placeholder="Content" />
					</Form.Item>
					<Form.Item name="date" rules={[{ required: true, message: 'Please select the date' }]}>
						<DatePicker />
					</Form.Item>
				</Form>
			</Modal>
			<List
				dataSource={announcements}
				renderItem={(item: AnnouncementResponse) => (
					<>
						<div style={{ fontFamily: 'monospace' }}>{item.userFirstName} {item.userLastName}</div>
						<List.Item>
							<List.Item.Meta
								avatar={<Avatar src={item.userPictureUrl} />}
								title={item.title}
								description={<div style={{ overflow: 'hidden', wordWrap: 'break-word' }}>{item.content}</div>}
							/>

							{new Date(item.time) < new Date() ?
								<div style={{ color: 'red', fontWeight: "bold" }}>{item.time}</div>
								:
								<div style={{ color: 'green', fontWeight: "bold" }}>{item.time}</div>}
						</List.Item>
					</>
				)}
			/>
		</Card>
	);
};

export default Announcements;
