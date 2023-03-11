import org.scalajs.linker.interface.OutputDirectory
import bloop.integrations.sbt.ScalaJsKeys
import scala.sys.process._

lazy val commonSettings = Seq(
  organization := "com.sustenage.menta.fontend.exercise",
  scalaVersion := "3.2.2",
  version := "1.0.0"
)

lazy val copyJs =
  taskKey[Unit]("A task to copy the output js file to the public direcotry")

lazy val root = (project in file("."))
  .aggregate(
    displayBlogData
  )

lazy val displayBlogData = (project in file("./display-blog-data"))
  .enablePlugins(ScalaJSPlugin)
  .settings(
    inThisBuild(commonSettings),
    name := "DisplayBlogData",
    // This is an application with a main method
    scalaJSUseMainModuleInitializer := true,
    libraryDependencies += "org.scala-js" %%% "scalajs-dom" % "2.4.0",
    libraryDependencies += "com.raquo" %%% "laminar" % "0.14.2",
    fastLinkJS := {
      val oldOutputDir = (ThisProject / Compile / fastLinkJSOutput).value
      val report = (ThisProject / Compile / fastLinkJS).value
      val jsFileName = report.data.publicModules.head.jsFileName
      val jsFilePath =
        java.nio.file.Path.of(oldOutputDir.toString, jsFileName).toFile

      val baseDirName = (ThisProject / Compile / thisProject).value.base.getName
      val newOutputDir = s"./public/apps/${baseDirName}"

      IO.copyFile(
        jsFilePath,
        java.nio.file.Path.of(newOutputDir, jsFileName).toFile
      )

      val sourceMapName = report.data.publicModules.head.sourceMapName
      sourceMapName.foreach { fname =>
        val sourceMapPath =
          java.nio.file.Path.of(oldOutputDir.toString, fname).toFile
        IO.copyFile(
          sourceMapPath,
          java.nio.file.Path.of(newOutputDir, fname).toFile
        )
      }

      report
    }
  )
