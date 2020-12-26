import React, { useEffect, useState } from 'react';
import './App.css'
import Tmbd from './Tmbd';
import MovieRow from './Components/MovieRow'
import FeaturedMovie from './Components/FeaturedMovie'
import Header from './Components/Header'

export default () => {

  const [movieList, setmovieList] = useState([]);
  const [featuredData, setfeaturedData] = useState();
  const [blackHeader, setblackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista total
      let list = await Tmbd.getHomeList();
      setmovieList(list)

      //pegando o featured
      let originals = list.filter(i => i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1))
      let chosen = originals[0].items.results[randomChosen]
      let chonsenInfo = await Tmbd.getMovieInfo(chosen.id, 'tv');
      setfeaturedData(chonsenInfo);
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setblackHeader(true)
      } else {
        setblackHeader(false)
      }
    }
    window.addEventListener('scroll', scrollListener)
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, []);
  return (
    <div className="page">
      <Header black={blackHeader} />
      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }
      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
      <footer>
        Feito por <a className="git" target="_blank" href="https://github.com/only-B">only-B</a> <br />
        Direitos de imagem para Netflix <br />
        Dados pegos do site <a className="themoviedb" target="_blank" href="https://www.themoviedb.org">themoviedb.org</a>
      </footer>
      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://www.filmelier.com/pt/br/news/wp-content/uploads/2020/03/netflix-loading.gif" alt="carregando" />
        </div>
      }
    </div>
  )
}