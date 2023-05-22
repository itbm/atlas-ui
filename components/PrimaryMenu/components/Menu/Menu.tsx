import { useContext } from 'react';

import HomeContext from '@/pages/api/home/home.context';

import PrimaryMenuContext from '../../PrimaryMenu.context';

const Menu = ({ screens }: { screens: JSX.Element[] }) => {
  const {
    state: { showPrimaryMenu, user },
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const {
    state: { selectedIndex },
  } = useContext(PrimaryMenuContext);

  const selectedScreen = screens[selectedIndex];

  return (
    <>
      <div
        className={`fixed w-[280px] h-full z-40 ${
          showPrimaryMenu ? 'left-[48px] ' : 'left-[-285px]'
        } flex flex-col space-y-2 bg-unsaged-menu p-2 
        text-[14px] transition-all md:fixed sm:fixed sm:top-0 border-unsaged-border border-r`}
      >
        {selectedScreen}
      </div>
    </>
  );
};

export default Menu;
