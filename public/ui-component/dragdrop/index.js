
window.onload = () => {
  const container = document.createElement(`div`);
  {
    container.style.width = `100vw`;
    container.style.height = `100vh`;

    const header = document.createElement(`div`);
    {
      header.style.height = `2rem`;
      header.style.display = `flex`;
      header.style.alignItems = `center`;
      header.style.padding = `4px`;
      header.style.fontWeight = `bold`;
      header.style.fontSize = `16px`;
      
      header.appendChild(document.createTextNode(`Drag & Drop`));
    }

    const main = document.createElement(`div`);
    {
      const state = {
	current: null,
      };
      
      main.style.height = `calc(100vh - 2rem)`;
      main.style.display = `flex`;
      main.style.justifyContent = `space-between`;
      
      const left = document.createElement(`div`);
      {
	left.style.width = `50vw`;
	left.style.border = `1px solid silver`;
	left.style.display = `flex`;
	left.style.alignContent = `flex-start`;
	left.style.padding = `4px`;
	left.style.flexWrap = `wrap`;
	left.style.gap = `4px`;
	left.style.overflow = `auto`;
	left.style.backgroundColor = `white`;
	
	left.addEventListener(`drop`, (e) => {
	  e.preventDefault();
	  if (state.current?.pos === `right`) {
	    right.removeChild(state.current?.item);
	    left.appendChild(state.current?.item);
	    state.current.pos = `left`;
	  }
	});
	left.addEventListener(`dragover`, (e) => {
	  e.preventDefault();
	  if (state.current?.pos === `right`) {
	    left.style.backgroundColor = `#DDEEFF`;
	  }
	});
	left.addEventListener(`dragleave`, (e) => {
	  e.preventDefault();
	  left.style.backgroundColor = `white`;
	});
      }
      
      const right = document.createElement(`div`);
      {
	right.style.width = `50vw`;
	right.style.border = `1px solid silver`;
	right.style.display = `flex`;
	right.style.alignContent = `flex-start`;
	right.style.padding = `4px`;
	right.style.flexWrap = `wrap`;
	right.style.gap = `4px`;
	right.style.overflow = `auto`;
	right.style.backgroundColor = `white`;

	right.addEventListener(`drop`, (e) => {
	  e.preventDefault();
	  if (state.current?.pos === `left`) {
	    left.removeChild(state.current?.item);
	    right.appendChild(state.current?.item);
	    state.current.pos = `right`;
	  }
	});
	right.addEventListener(`dragover`, (e) => {
	  e.preventDefault();
	  if (state.current?.pos === `left`) {
	    right.style.backgroundColor = `#DDEEFF`;
	  }
	});
	right.addEventListener(`dragleave`, (e) => {
	  e.preventDefault();
	  right.style.backgroundColor = `white`;
	});
      }
      
      const items = Array.from({length: 20}).map((_, i) => {
	
	const item = document.createElement(`div`);
	{
	  const itemState = {
	    pos: 'left',
	    item,
	  };
	  
	  item.style.backgroundColor = `royalblue`;
	  item.style.color = `white`;
	  item.style.weight = `bold`;
	  item.style.padding = `4px`;
	  item.style.width = `80px`;
	  item.style.height = `80px`;
	  item.style.border = `1px solid black`;
	  item.setAttribute(`draggable`, true);
	  
	  item.addEventListener('dragstart', (e) => {
	    state.current = itemState;
	  });
	  item.addEventListener('dragend', (e) => {
	    e.preventDefault();
	    state.current = null;
	    left.style.backgroundColor = `white`;
	    right.style.backgroundColor = `white`;
	  });
	}
	
	const text = document.createTextNode(`Item${i+1}`);
	item.appendChild(text);
	left.appendChild(item);
	return item;
      });

      main.appendChild(left);
      main.appendChild(right);
    }
    
    container.appendChild(header);
    container.appendChild(main);
  }
  
  document.body.appendChild(container);
};
