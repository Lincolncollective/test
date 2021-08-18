import React from "react";
import DynamicComponent from "../components/DynamicComponent";
import Head from "next/head";
import styles from "../styles/Home.module.css";
 
import Storyblok, { useStoryblok } from "../lib/storyblok";
 
export default function Page({ story, preview }) {
  const enableBridge = true; // load the storyblok bridge everywhere
  // const enableBridge = preview; // enable bridge only in prevew mode
  story = useStoryblok(story, enableBridge, locale);
 
  return (
    <div className={styles.container}>
      <Head>
        <title>{story ? story.name : "My Site"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
 
      <DynamicComponent blok={story.content} />
    </div>
  );
}
 
export async function getStaticProps({ params, preview = false }) {
  let slug = params.slug ? params.slug.join("/") : "home";
 
  let sbParams = {
    version: "draft", // or published
  };
 
  if (preview) {
    sbParams.version = "draft";
    sbParams.cv = Date.now();
  }
 
  // load the stories insides the pages folder
  let { data } = await Storyblok.get(`cdn/stories/pages/${slug}`, sbParams);
 
  return {
    props: {
      story: data ? data.story : null,
      preview,
    },
    revalidate: 3600, // revalidate every hour
  };
}
 
export async function getStaticPaths() {
  let { data } = await Storyblok.get('cdn/links/', {
      starts_with: 'pages'
  })
 
  let paths = [];
  Object.keys(data.links).forEach((linkKey) => {
    // don't create routes for folders and the index page
    if (data.links[linkKey].is_folder || data.links[linkKey].slug === "home") {
      return;
    }
 
    // get array for slug because of catch all
    const slug = data.links[linkKey].slug;
    // remove the pages part from the slug
    let newSlug = slug.replace('pages', '')
    let splittedSlug = newSlug.split("/");
 
    paths.push({ params: { slug: splittedSlug } });
  });
 
  return {
    paths: paths,
    fallback: false,
  };
}