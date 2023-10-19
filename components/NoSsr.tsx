//component used to make sure that children do not render until component mounts
//this prevents issues with a mismatch in props between the server and client
//TODO: research and try to figure out if a better solution is possible

import { useEffect, useState } from "react"

type Props = {
    children: React.ReactNode
}

export default function NoSsr({ children }: Props) {
    const [isMounted, setMount] = useState(false)

    useEffect(() => {
        setMount(true)
    }, [])

    return <>{isMounted ? children : null}</>
}
