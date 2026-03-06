export default async function handler(req, res) {

const path = req.query.path

const response = await fetch(`https://api.jikan.moe/v4/${path}`)

const data = await response.json()

res.status(200).json(data)

}
