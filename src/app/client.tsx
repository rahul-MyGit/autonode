"use client"

export const Client = ({users}: {users: {greeting: string}}) => {
    return (
        <div>
            Client Component
            <pre>{JSON.stringify(users, null, 2)}</pre>
        </div>
    )
}
