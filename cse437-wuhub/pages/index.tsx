import { ReactDOM } from "react"
import Link from "next/link"
import { useRouter } from "next/router"

export default function Home() {

  const router = useRouter();

  const loginClick = () => {
    console.log("login click");
    router.push('/LoginPage')
  }

  const registerClick = () => {
    console.log("register click");
    router.push('/RegisterPage')
  
  }

  return (
    <>
      <div className="index-header">
        Welcome to WUhub
      </div>

      <div className="index-body">
        <button className="btn" onClick={loginClick}> Login </button>
        <br></br>
        <button className="btn" onClick={registerClick}> Register </button>
      </div>

    </>
  )
}
