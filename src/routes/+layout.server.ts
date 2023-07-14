import type { LayoutServerLoad } from "./$types"
// @ts-ignore
export const load: LayoutServerLoad = async (event) => {
  return {
    session: await event.locals.getSession(),
  }
}