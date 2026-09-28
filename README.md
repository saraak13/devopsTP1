# Personal Finance Tracker

A lightweight, browser-based personal finance management application built with vanilla JavaScript[cite: 2] and HTML5/CSS3[cite: 1]. It helps you monitor monthly expenses via an interactive calendar[cite: 1, 2], track physical cash and bill denominations using a wallet manager[cite: 1, 2], and keep tabs on overall savings and budgets[cite: 1, 2].

## Features

* **Interactive Expense Calendar**: Navigate through months[cite: 2], view daily expense entries[cite: 2], and track weekly totals[cite: 2].
* **Wallet Manager**: Count and organize cash bills and coins by denomination (from 200 MAD down to 0.5 MAD)[cite: 1, 2] across home and wallet storage[cite: 2].
* **Budget Tracking**: Set and edit monthly budgets dynamically[cite: 2].
* **Local Storage Integration**: All financial inputs, wallet denominations, and expense entries are automatically saved to your browser's `localStorage`[cite: 2].

## Project Structure

```text
├── index.html        # Main dashboard interface
├── app.js            # Core application logic and event handling
├── data.js           # Data structures and bill denominations definition
└── template/
    └── style.css     # Stylesheet for layout and design
