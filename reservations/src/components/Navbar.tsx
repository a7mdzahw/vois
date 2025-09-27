'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classnames from 'classnames';
import {
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/react';

import { useUser, UserButton } from '@clerk/nextjs';
import {
  ArrowRightIcon,
  CalendarIcon,
  ListBulletIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'List', href: '/', icon: <ListBulletIcon className="w-4 h-4" /> },
  {
    name: 'Calendar',
    href: '/reservations',
    icon: <CalendarIcon className="w-4 h-4" />,
  },
  { name: 'Reserve', href: '/reserve', icon: <PlusIcon className="w-4 h-4" /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <NextUINavbar
      maxWidth="xl"
      className="bg-white shadow-md border-b border-gray-200"
      isBordered
    >
      <NavbarContent>
        <NavbarMenuToggle className="sm:hidden" />
        <NavbarBrand>
          <Link href="/" className="flex items-center space-x-2">
            {/* Vodafone Logo */}
            <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <div className="flex flex-col">
              <p className="font-bold text-gray-800 text-lg">VOIS</p>
              <p className="text-xs text-gray-500 -mt-1">Office Reservations</p>
            </div>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name} isActive={pathname === item.href}>
            <Link
              href={item.href}
              className={classnames(
                'px-4 py-2 rounded-sm transition-colors duration-200 flex items-center gap-2',
                {
                  'bg-red-100 text-red-700 font-semibold':
                    pathname === item.href,
                  'text-gray-600 hover:text-red-600 hover:bg-red-50':
                    pathname !== item.href,
                }
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {user ? (
          <NavbarItem>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                  userButtonPopoverCard: 'shadow-lg border border-gray-200',
                  userButtonPopoverActionButton: 'hover:bg-gray-50',
                  userButtonPopoverActionButtonText: 'text-gray-700',
                  userButtonPopoverFooter: 'hidden',
                },
              }}
            />
          </NavbarItem>
        ) : (
          <NavbarItem>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-700 transition-colors font-medium text-medium flex items-center gap-2"
              >
                Login <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item.name}-${index}`}>
            <Link
              className={classnames(
                'w-full px-4 py-2 rounded-sm transition-colors duration-200 flex items-center gap-2',
                {
                  'text-red-600 font-semibold': pathname === item.href,
                  'text-gray-600': pathname !== item.href,
                }
              )}
              href={item.href}
            >
              {item.icon}
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </NextUINavbar>
  );
}
