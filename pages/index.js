import Head from "next/head"
import styles from "../styles/Home.module.css"
 
// The Storyblok Client
import Storyblok from "../lib/storyblok"
import DynamicComponent from '../components/DynamicComponent'
 
export default function Home(props) {
  const story = props.story
 
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
 
      <header>
        <h1>
          { story ? story.name : 'My Site' }
        </h1>
      </header>
 
       <DynamicComponent blok={story.content} />
    </div>
  )
}
 
export async function getStaticProps(context) {
  let slug = "home"
  let params = {
    version: "draft", // or 'published'
  }
 
  if (context.preview) {
    params.version = "draft"
    params.cv = Date.now()
  }
 
  let { data } = await Storyblok.get(`cdn/stories/${slug}`, params)
 
  return {
    props: {
      story: data ? data.story : false,
      preview: context.preview || false
    },
    revalidate: 10, 
  }
}