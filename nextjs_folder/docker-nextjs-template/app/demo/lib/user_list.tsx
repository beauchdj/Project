"use client";

import { User } from "next-auth";
import { AddUser } from "./add_user";
import { useState } from "react";
import { RemoveUser } from "./remove_user";

export function UserList({ user_list }: { user_list: User[] }) {
  // useState as a react hook allows you to store data and when that data changes it will reflect on the page
  const [users, setUsers] = useState<User[]>(user_list); // useState allows us to re-render the page when we update the REFERENCE to the list, aka create a new list when we want to update it so react will re-render the page/update list

  // function that is called by <AddUser> so we can update list when form is submitted
  function addUser(user: User) {
    setUsers([...users, user]); // creates a new array with old items from users and new item we added
  }

  function removeUser(username: string) {
    const filtered: User[] = users.filter((user_) => {
      // filter by username, resulting list is everything except the passed in username
      return user_.username !== username;
    });

    setUsers(filtered); // give set users a new reference to an array ( triggers a re-render )
  }

  return (
    <div className="flex justify-center items-center flex-col w-full h-full">
      <AddUser addUser={addUser} />
      <p className="m-1">User List:</p>
      <div className="flex flex-col justify-content items-center bg-blue-500 text-white overflow-auto w-[90%]">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex justify-center items-center text-center flex-col w-full"
          >
            {user.username}
            <RemoveUser user={user} removeUser={removeUser} />
          </div>
        ))}
      </div>
    </div>
  );
}
