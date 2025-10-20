# Creating Routes

If we look at our current homepage route, it looks like this:

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return <>My App</>;
}
```

This is the format for all routes. The `createFileRoute` function takes a string as the first argument, which is the path for the route. The second argument is an object that contains the component for the route. There are other things that we can add here as well such as loaders.

## Add A New Route

To create a new route, we create a new file in the `routes` folder.

So create a new file called `ideas.tsx` in the `routes` folder. You may notice that it will add the following code automatically:

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ideas')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/ideas"!</div>;
}
```

This surprised me when I first saw it. This is actually the "@tanstack/router-plugin" package that does this.

The only thing here I want to change is the name of the component. Let's change it to `IdeasPage`:

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ideas')({
  component: IdeasPage,
});

function IdeasPage() {
  return <div>Hello "/ideas/"!</div>;
}
```

Now open your browser and go to `http://localhost:3000/ideas`. You should see the text "Hello "/ideas"!".

## Using Folders

This is one way to create a route to ideas, however, you can also create a folder for the route. This is useful if you want to create a nested route or if you want to group related routes together. I would prefer to use folders for all routes rather than single files.

Delete the `ideas.tsx` file and create a new folder called `ideas` in the `routes` folder and a new file called `index.tsx` in the `ideas` folder. This will be the entry point for the ideas route.

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ideas/')({
  component: IdeasPage,
});

function IdeasPage() {
  return <div>Hello "/ideas/"!</div>;
}
```

If the route is an index page, the path will be `/ideas/` instead of `/ideas`. This is because the index page is the default page for the folder.

## Creating Nested Routes

To create a nested route, create a new file called `new.tsx` in the `ideas` folder. This will be the entry point for the create idea route. You can also create subfolders to nest further.

You should be able to go to `http://localhost:3000/ideas` and see the text "Hello "/ideas"!". You can also go to `http://localhost:3000/ideas/new` and see the text "Hello "/ideas/new"!".

## Creating Dynamic Routes

To create a dynamic route, create a new file called `$ideaId.tsx` in the `ideas` folder. This will be the entry point for the idea route. The ideaId is a dynamic parameter that will be passed to the route.

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ideas/$ideaId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/ideas/$ideaId/"!</div>;
}
```

There are a few ways to get this value. You can use the `useParams` hook, but we can also access it via a `loader`, which I will show you later.

You can now go to `http://localhost:3000/ideas/1` and replace the `1` with any number.

In this case, I would want this to be a folder as well. Create a folder at `ideas/$ideaId` and move the `ideaId.tsx` file into it. Rename the file to `index.tsx`.

The reason that I did this is because we may want a route like `/ideas/$ideaId/edit` in the future. This way, we can create a new file called `edit.tsx` in the `$ideaId` folder and it will be a nested route.

## Flat Routes

In addition to folder-based routes, we can also create flat routes. We won't keep these but let's create a file at `src/routes/users.index.tsx` and add the following code:

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/users')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/users"!</div>;
}
```

This will render at `http://localhost:3000/users`.

Now create `src/routes/users.profile.tsx` and add the following code:

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/users/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/users/profile"!</div>;
}
```

This will render at `http://localhost:3000/users/profile`.

If you wanted a dynamic route, you could create a file called `src/routes/users.$userId.tsx` and add the following code:

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/users/$userId')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/users/$userId"!</div>;
}
```

This will render at `http://localhost:3000/users/1` or `http://localhost:3000/users/2`.

If you want something like users/1/edit, you can create a file called `src/routes/users_.$userId.edit.tsx` and add the following code:

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/users_/$userId/edit')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/users/_$userId/edit"!</div>;
}
```

You need to make sure that you add the underscore `_` in the file name so that it doesn't conflict with the dynamic route. This will render at `http://localhost:3000/users/1/edit` or `http://localhost:3000/users/2/edit`.

So those are flat routes. You can also use a mix of file-based and flat routes.

You can delete all the user routes now. We won't be using them, I just wanted to show you how they work.
