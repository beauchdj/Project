"use client";

import { User } from "next-auth";
import { AddUser } from "./add_user";
import { useState } from "react";
import { RemoveUser } from "./remove_user";
/**
 * The UserList is a client side componenet that is sent to the user.
 *  We maintain the list on the user side meaning:
 *    when we add a user we have logic that visually updates the list, and other logic that talks to the database and says add this user
 *    when we delete a user we have logic that visually removes the user from the list, and other logic that talks to the backend saying delete this user from the database.
 */
export function UserList({ user_list }: { user_list: User[] }) {
  // useState as a react hook allows you to store data and when that data changes it will reflect on the page
  const [users, setUsers] = useState<User[]>(user_list);

  // Our logic that adds a user to a list
  function addUser(user: User) {
    setUsers([...users, user]); // creates a new array with old items from users and new item we added
  }

  // Our logic that removes a user from the list
  function removeUser(username: string) {
    // filter out the username we got passed in
    const filtered: User[] = users.filter((user_) => {
      return user_.username !== username;
    });

    // set our list to the filtered version
    setUsers(filtered); // give set users a new reference to an array ( triggers a re-render )
  }

  // this is where the html is created
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
            <div>{user.username}</div>
            <RemoveUser user={user} removeUser={removeUser} />
          </div>
        ))}
      </div>
    </div>
  );
}
