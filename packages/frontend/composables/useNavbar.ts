import { TypedRouteLocationRaw } from "~~/.generated/typed-router";
import { TypedRouteList } from "../.generated";

export type NavbarItem = {
  name: string;
  button?: "primary" | "text";
  to?: TypedRouteLocationRaw<TypedRouteList>;
  onClick?: () => void;
  active?: boolean;
};

export interface Navbar {
  hideItems?: boolean;
  items?: NavbarItem[];
  logoAction?: {
    to?: TypedRouteLocationRaw<TypedRouteList>;
    onClick?: () => void;
  };
}

const items = ref<NavbarItem[]>([]);
const hideItems = ref(false);
const logoAction = ref<Navbar["logoAction"]>();

export function useNavbarState() {
  return { items, hideItems, logoAction };
}

export default function useNavbar(navbar: Navbar) {
  if (navbar.items) {
    items.value = navbar.items;
  }
  if (navbar.logoAction) {
    logoAction.value = navbar.logoAction;
  }
  hideItems.value = navbar.hideItems ?? false;

  function showItems() {
    hideItems.value = false;
  }

  function setActiveItem(name: string) {
    for (const item of items.value) {
      if (item.name === name) {
        item.active = true;
      } else if (item.active) {
        item.active = false;
      }
    }
  }

  return { showItems, setActiveItem };
}
