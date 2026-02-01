export const useMarkdown = () => {
  const renderMarkdown = async (content: string | undefined): Promise<string> => {
    if (!content) return ''

    if (import.meta.client) {
      const { marked } = await import('marked')
      return marked.parse(content) as string
    }

    return content
  }

  return {
    renderMarkdown
  }
}
