// UserSearch.tsx
import React, { useState, useEffect } from 'react';
import { Input, List, Avatar, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '../app/slices/user.slice';
import { useGetUsersEndpointMutation } from '../app/slices/auth.api.slice';

import styles from "../styles/Pages/UserSearch.module.css"

import { User } from '../ts/interfaces';

const UserSearch: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  const [GetUsersEndpoint] = useGetUsersEndpointMutation();
  const language: string = useSelector((state: { language: { currentLanguage: string } }) => state.language.currentLanguage);
  const [languagePack, setLanguagePack] = useState<any>("");

  useEffect(() => {
    const fetchLanguagePack = async () => {
      try {
        let pack = await import(`../assets/translations/${language}.json`);
        setLanguagePack(pack);
      } catch (error) {
        console.error(`Failed to load language pack for ${language}`, error);
      }
    };

    fetchLanguagePack();
  }, [language]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await GetUsersEndpoint(undefined).unwrap();
        console.log(response)
        dispatch(setUsers(response));
      } catch (error) {
        console.error(error)
      }
    }
    fetchUsers();
  }, [])

  const { users } = useSelector((state: any) => state.users)

  const filteredUsers: User[] = users
    ?.filter((user: User) => user?.firstName.toLowerCase().includes(searchText?.toLowerCase()))
    .slice(0, 15);

  {/*const AddToFavourites = (user: User) => {
    const userExists = favourites.find((favUser: User) => favUser.email === user.email);
    if (!userExists) {
      dispatch(addFavourites(user));
      message.success(`${user.firstName} ${languagePack?.UserSearch?.success}`);
    } else {
      message.warning(`${languagePack?.UserSearch?.warning}`);
    }
  }*/}

  return (
    <Card className={styles.user_search_container} style={{ background: '#FFFFFF', padding: '24px', minHeight: '360px' }}>
      <h1 style={{ marginBottom: "12px" }}>{languagePack?.UserSearch?.title}</h1>
      <Input
        placeholder={languagePack?.UserSearch?.title}
        onChange={e => setSearchText(e.target.value)}
        style={{ marginBottom: '24px' }}
      />

      <List
        itemLayout="horizontal"
        dataSource={filteredUsers}
        renderItem={(user: User) => (
          <List.Item className={styles.user_list_item} key={user.id}>
            <List.Item.Meta
              avatar={<Avatar src={user.pictureUrl} />}
              title={`${user.firstName} ${user.lastName}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default UserSearch;
