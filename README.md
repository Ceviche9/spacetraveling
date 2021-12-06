<h1 align="center">
    SpaceTraveling - Next.js
</h1>

<p align="center">Aplicação em formato de blog utilizando Prismic CMS</p>

![113493479-eceeda80-94b5-11eb-94ea-59e50e56a31f](https://user-images.githubusercontent.com/83431609/140555145-18d008da-d651-4526-871e-2553bad4cd07.png)

## 📖 Sobre o projeto

O projeto tem como objetivo o estudo e desenvolvimento de uma aplicação em ReactJS com NextJS para listagem de posts de um blog. A aplicação foi desenvolvida utilizando o framework NextJS aplicando os conceitos de Static Site Generation (SSG) e utilizando Prismic CMS para adição e gerenciamento do conteúdo dos posts. O projeto foi desenvolvido como desafio das aulas do modulo 03 do [Ignite da Rocketseat](https://rocketseat.com.br/), porém ainda utilizo como blog para postar alguns artigos/tutoriais.

---

![image](https://user-images.githubusercontent.com/83431609/140818662-c6eedbb8-055e-4496-b061-a80a87860159.png)

No final de cada post tem um espaço para comentários, que foi feito utilizando a biblioteca [utterances](https://github.com/utterance/utterances)

![image](https://user-images.githubusercontent.com/83431609/140819150-bb41755d-e031-4c45-83bb-b4a91e3a698e.png)

Link do [Projeto](https://spacetraveling-tun.vercel.app/)

Link do [desafio](https://www.notion.so/Desafio-01-Criando-um-projeto-do-zero-b1a3645d286b4eec93f5f1f5476d0ff7)

Link do [desafio complementar](https://www.notion.so/Desafio-02-Adicionando-features-ao-blog-d466866c02544c79bbada9717c033d0a)

## 💻 O que tem no projeto?

* Front-end bem clean, desenvolvido seguindo o proposto no [Figma](https://www.figma.com/file/0Y26j0tf1K2WB5c1ja5hov/Desafios-M%C3%B3dulo-3-ReactJS?node-id=0%3A1).
* Integração com o Prismic CMS, para trabalhar com toda a parte do sistema do blog.
* Integração com o sistema de Preview do Prismic, onde é possível ver um post não publicado dentro do blog, antes mesmo dele ir ao ar.
* Uso do sistema estático do Next.js, onde os posts são mantidos no cache para um melhor carregamento.

## 🏃🏾 Testes

Para estar completo, o projeto deve passar pelos seguintes testes quando é entregue na plataforma da rocketseat:

- [x] Header should be able to render logo
- [x] Header should be able to navigate to home page after a click
- [x] Post should be able to return prismic posts documents paths using getStaticPaths
- [x] Post should be able to return prismic post document using getStaticProps
- [x] Post should be able to render post document info
- [x] Post should be able to render loading message if fallback
- [x] Home should be able to return prismic posts documents using getStaticProps
- [x] Home should be able to render posts documents info
- [x] Home should be able to navigate to post page after a click
- [x] Home should be able to load more posts if available
- [x] Home should not be able to load more posts if not available

Resultado do Projeto:

![image](https://user-images.githubusercontent.com/83431609/140582264-1d732358-8519-4fd1-ab06-16239004d8d4.png)

## 🛠️ Tecnologias.

* [React](https://pt-br.reactjs.org/E)
* [Next.js](https://nextjs.org/)
* [Prismic CMS](https://prismic.io/)
* [utterances](https://github.com/utterance/utterances)


&nbsp;



## 📝 Licença.

Este projeto está licenciado sob a Licença MIT. Veja o arquivo de [LICENÇA](https://github.com/GBDev13/space-traveling/blob/master/LICENSE) para detalhes.


---
