export const getGreeting = (): string => {
  return 'Hello, Test!'
}

export const requestHandler = (req: Request, res: Response): string => {
  if (req.url === '/') {
    return 'welcome home'
  } else {
    return 'go away'
  }
}
