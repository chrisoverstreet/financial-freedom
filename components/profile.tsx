import { useStytch, useStytchSession, useStytchUser } from '@stytch/nextjs';

export default function Profile() {
  const stytch = useStytch();
  const { user } = useStytchUser();
  const { session } = useStytchSession();

  return (
    <div className='card'>
      <h1>Profile</h1>
      <h2>User object</h2>
      <pre className='code-block'>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>

      <h2>Session object</h2>
      <pre className='code-block'>
        <code>{JSON.stringify(session, null, 2)}</code>
      </pre>
      <p>
        You are logged in, and a Session has been created. The SDK stores the
        Session as a token and a JWT in the browser cookies as{' '}
        <span className='code'>stytch_session</span> and{' '}
        <span className='code'>stytch_session_jwt</span> respectively.
      </p>
      {/* Revoking the session results in the session being revoked and cleared from browser storage. The user will return to Login.js */}
      <button className='primary' onClick={() => stytch.session.revoke()}>
        Log out
      </button>
    </div>
  );
}
