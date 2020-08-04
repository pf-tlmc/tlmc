import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { DataConsumer } from '../../src/components/DataContext'
import PageContainer from '../../src/components/PageContainer'
import Section from '../../src/components/Section'
import DirectoryViewer from '../../src/viewers/DirectoryViewer'
import DirectoryViewerVirtualized from '../../src/viewers/DirectoryViewerVirtualized'
import AlbumViewer from '../../src/viewers/AlbumViewer'
import AlbumListViewer from '../../src/viewers/AlbumListViewer'
import FileViewer from '../../src/viewers/FileViewer'
import Error404 from '../404'
import { hasAlbum } from '../../src/utils'

const TLMC = () => {
  const router = useRouter()

  return (
    <DataConsumer>
      {({ data: { ls, cue } }) => {
        // Get the path from the URL and the corresponding node
        let node = ls
        const { tlmc_path: tlmcPath } = router.query
        let circle

        if (tlmcPath) {
          for (let i = 0; i < tlmcPath.length; ++i) {
            node = node.get(tlmcPath[i])
            if (node) {
              circle = circle || node.base
            } else {
              return <Error404 />
            }
          }
        }

        // Path points to a valid node
        return (
          <>
            <Head>
              <title>{node.isRoot ? 'Touhou Lossless Music Collection' : circle}</title>
            </Head>
            {(() => {
              if (node.isRoot) {
                return (
                  <DirectoryViewerVirtualized
                    contained
                    title='Touhou Lossess Music Collection'
                    directory={node}
                    filter={(node) => node.isDirectory}
                  />
                )
              } else if (node.isDirectory) {
                let showAlbums = false
                for (const file of node) {
                  if (hasAlbum(file, true)) {
                    showAlbums = true
                    break
                  }
                }

                return (
                  <PageContainer>
                    {showAlbums && (
                      <Section>
                        <AlbumListViewer directory={node} />
                      </Section>
                    )}
                    {hasAlbum(node) && (
                      [...node.files]
                        .filter((file) => file.ext.toLowerCase() === '.cue')
                        .map((file) =>
                          <Section key={file.path}>
                            <AlbumViewer cueFile={file} />
                          </Section>
                        )
                    )}
                    <Section title='All Files'>
                      <DirectoryViewer directory={node} />
                    </Section>
                  </PageContainer>
                )
              } else {
                return (
                  <PageContainer>
                    <Section title={node.base}>
                      <FileViewer file={node} />
                    </Section>
                  </PageContainer>
                )
              }
            })()}
          </>
        )
      }}
    </DataConsumer>
  )
}

export default TLMC
