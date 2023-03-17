# FSM Generator

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

FSM Generator is a web application that allows you to generate finite state machines (FSM) / Deterministic Finite Automata (DFA) from regular expressions. You can generate random regular expressions to test the application.

FSM Generator offers two ways of generating FSMs: static and interactive. The static option generates a static image of the FSM and allows you to download it in high resolution. The interactive option generates a dynamic FSM using viz network within a canvas, allowing you to drag and move nodes.

For both options, a panel displays information about the number of states and the number of acceptance states, as well as a table of states.

## Libraries Used

FSM Generator was developed using pure JavaScript and HTML, with the following libraries:

- [Viz](https://github.com/mdaines/viz.js/): a JavaScript library for rendering Graphviz graphs.
- [Noam](https://github.com/izuzak/noam): a JavaScript library for working with formal languages, grammars, and automata.

## Getting Started

To run the app, simply visit the following link: https://ralo-dev.github.io/FSM-Generator/


## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](https://github.com/ralo-dev/FSM-Generator/blob/main/LICENSE) file for details.
