package com.sustenage.menta.fontend.exercise.display.blog.data;

import org.scalajs.dom
import scala.scalajs.js
import com.raquo.laminar.api.L.{*, given}

enum PageType:
  case BlogList
  case BlogListByTag
  case BlogPost
  case BlogData

def renderPosts(posts: js.Array[PostJson]) =
  div(
    posts.map { post =>
      div(
        h2(
          a(
            href := s"${dom.window.location.pathname}?page=blog-post&id=${post.id}",
            post.title.toUpperCase
          )
        ),
        div(new js.Date(post.date).toISOString)
      )
    }
  )

def blogListPage(offset: Int, size: Int) = div(
  display := "flex",
  flexDirection := "column",
  alignItems := "center",
  h1("My Blog Posts"),
  hr(width := "100%"),
  div(s"${offset} - ${offset + size}"),
  div(
    BlogData.posts.slice(offset, offset + size) |> renderPosts
  ),
  hr(width := "100%"),
  div(
    padding := "8px",
    display := "flex",
    justifyContent := "space-between",
    alignItems := "center",
    a(
      paddingRight := "12px",
      href := s"${dom.window.location.pathname}?offset=${offset - size}&size=${size}",
      "Back"
    ),
    a(
      paddingLeft := "12px",
      href := s"${dom.window.location.pathname}",
      "Home"
    ),
    a(
      paddingLeft := "12px",
      href := s"${dom.window.location.pathname}?offset=${offset + size}&size=${size}",
      "Next"
    )
  )
)

def blogListByTag(tag: String) = div(
  display := "flex",
  flexDirection := "column",
  alignItems := "center",
  h1(s"Blog Posts In ${tag}"),
  hr(width := "100%"),
  BlogData.posts.filter(_.tags.contains(tag)) |> renderPosts,
  hr(width := "100%"),
  div(
    padding := "8px",
    a(
      paddingLeft := "12px",
      href := s"${dom.window.location.pathname}",
      "Home"
    )
  )
)

def blogPostPage(id: Int) = BlogData.posts.find(_.id == id) match
  case None => invalidParamPage
  case Some(post) =>
    div(
      h1(padding := "8px", post.title),
      div(post.tags.map { tag =>
        span(
          padding := "8px",
          a(
            href := s"${dom.window.location.pathname}?page=blog-list-by-tag&tag=${tag}",
            tag
          )
        )
      }),
      hr(width := "100%"),
      div(padding := "8px", new js.Date(post.date).toISOString),
      div(padding := "8px", post.body.map { line => p(line) }),
      hr(width := "100%"),
      div(
        padding := "8px",
        a(
          paddingLeft := "12px",
          href := s"${dom.window.location.pathname}",
          "Home"
        )
      )
    )

def invalidParamPage = div("Invalid Params")

def renderApp =
  documentEvents.onDomContentLoaded.foreach { _ =>
    val queryString = dom.window.location.search
    val params = new dom.URLSearchParams(queryString)

    val page = Option(params.get("page")) match
      case None                     => PageType.BlogList
      case Some("blog-list")        => PageType.BlogList
      case Some("blog-list-by-tag") => PageType.BlogListByTag
      case Some("blog-post")        => PageType.BlogPost
      case Some("blog-data")        => PageType.BlogData
      case _                        => PageType.BlogList

    val body = page match {
      case PageType.BlogList =>
        val offset = Option(params.get("offset")) match
          case None    => 0
          case Some(n) => n.toInt

        val size = Option(params.get("size")) match
          case None    => 10
          case Some(n) => n.toInt

        blogListPage(offset, size)

      case PageType.BlogListByTag =>
        Option(params.get("tag")) match
          case None      => invalidParamPage
          case Some(tag) => blogListByTag(tag)

      case PageType.BlogPost =>
        Option(params.get("id")) match
          case None     => invalidParamPage
          case Some(id) => blogPostPage(id.toInt)

      case PageType.BlogData =>
        div(js.JSON.stringify(BlogData.posts))

    }

    val appContainer: dom.Element = dom.document.body
    render(appContainer, body)
  }(unsafeWindowOwner)
