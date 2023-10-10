import "dotenv/config"

export const getCorsProxy = (index?: number) => {
    return `${process.env.proxy}`
}

export default getCorsProxy