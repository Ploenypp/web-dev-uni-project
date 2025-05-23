# Schéma logique de la base de données MongoDB

Ce fichier décrit la structure logique des collections utilisées dans notre base de données MongoDB.

---

## Collection : `users`

```js
{
    _id: ObjectId,
    fstname: String,
    surname: String,
    dob: Date,
    username: String,
    password: String,
    status: String,
    team: String
}
```

## Collection : `registrations`

```js
{
    _id: ObjectId,
    fstname: String,
    surname: String,
    dob: Date,
    username: String,
    password: String
}
```

## Collection : `posts`

```js
{
    _id: ObjectId,
    title: String,
    author: String,
    userID: ObjectId,
    timestamp: Date,
    content: String
}
```

## Collection : `comments`

```js
{
    _id: ObjectId,
    parentPostID: ObjectId,
    author: String,
    userID: ObjectId,
    timestamp: Date,
    content: String
}
```

## Collection : `notifications`

```js
{
    _id: ObjectId,
    recipientID: ObjectId,
    subject: String,
    body: String
}
```

## Collection : `friends`

```js
{
    _id: ObjectId,
    friend1ID: ObjectId,
    friend1_name: String,
    friend2ID: ObjectId,
    friend2_name: String,
    messages: [
        {
            authorID: ObjectId,
            author: String,
            content: String,
            timestamp: Date
        }
    ]
}
```

## Collection : `friend_requests`

```js
{
    _id: ObjectId,
    recipientID: ObjectId,
    senderID: ObjectId,
    sender_fstname: String,
    sender_surname: String
}
```

## Collection : `flagged_posts`

```js
{
    _id: ObjectId,
    reports: Number,
    users: [ObjectId],
    authorID: ObjectId,
    author: String,
    title: String,
    content: String
}
```

## Collection : `admin_posts`

```js
{
    _id: ObjectId,
    title: String,
    author: String,
    userID: ObjectId,
    timestamp: Date,
    content: String
}
```

## Collection : `profile_pictures`

```js
{
    _id: ObjectId,
    contentType: String,
    image: Binary,
    user: ObjectId,
    date: Date
}
```

## Collection : `placeholders`

```js
{
    _id: ObjectId,
    contentType: String,
    image: Binary,
    name: String,
    date: Date
}
```

## Collection : `icons`

```js
{
    _id: ObjectId,
    contentType: String,
    image: Binary,
    name: String
}
```
