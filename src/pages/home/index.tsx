import { useState, FormEvent, useEffect } from 'react';
import styles from './home.module.css';
import { BsSearch } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';

export interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProp {
  data: CoinProps[];
}

export function Home() {
  const [input, setInput] = useState('');
  const [coins, setCoins] = useState<CoinProps[]>([]);
  const [offset, setOffset] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, [offset]);

  async function getData() {
    try {
      const response = await fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`);
      const data: DataProp = await response.json();
      const coinsData = data.data;

      const price = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      });

      const priceCompact = Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact'
      });

      const formatedResult = coinsData.map((item) => {
        return {
          ...item,
          formatedPrice: price.format(Number(item.priceUsd)),
          formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
        };
      });

      setCoins((prevCoins) => [...prevCoins, ...formatedResult]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (input === '') return;

    navigate(`/detail/${input}`);
  }

  function handleGetMore() {
    setOffset((prevOffset) => prevOffset + 10);
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda... EX bitcoin"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#FFF" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coins.map((item) => (
            <tr className={styles.tr} key={item.id}>
              <td className={styles.tdLabel} data-label="Moeda">
                <div className={styles.name}>
                  <img
                    className={styles.logo}
                    alt="Logo Cripto"
                    src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
                  />
                  <Link to={`/detail/${item.id}`}>
                    <span>{item.name}</span> | {item.symbol}
                  </Link>
                </div>
              </td>
              <td className={styles.tdLabel} data-label="Valor mercado">
                {item.formatedMarket}
              </td>
              <td className={styles.tdLabel} data-label="Preço">
                {item.formatedPrice}
              </td>
              <td className={styles.tdLabel} data-label="Volume">
                {item.formatedVolume}
              </td>
              <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança 24h">
                <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className={styles.buttonMore} onClick={handleGetMore}>
        Carregar mais
      </button>
    </main>
  );
}
