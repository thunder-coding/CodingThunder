---
author: "Yaksh Bariya"
title: "Solution to HackSlash SigSTP: Trial of Cheaters Path problem"
description: "How I managed to solve all of the HackSlash' SigSTP Induction problems"
tags: ["NIT Patna", "hackslash", "sigstp", "competitive programming", "problem solving", "programming", "coding"]
publishdate: "2025-03-18T23:35:00+05:30"
lastmod: "2025-03-18T23:50:00+05:30"
---

> [!note]
>
> If you would like to see my final submitted code, you can find it on [thunder-coding/Hackslash-SigSTP2025-Solutions](https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions)

# Background

One of the coding clubs at NIT Patna, HackSlash recently conducted a induction where problems were given for joining the club. I guess the idea is that people who solved the most of the problems with the best approach would be selected in the club. There were different tasks for different team. Since I wanted to join the DSA Team (also called SigSTP team), I did these problems.

## Problems

For people outside of NITP reading this blog, if you want to see the problems you can view a copy of the problem statements on the GitHub repository linked above:

- [Task 1: ATM Machine Problem Statement](https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions/blob/master/Task-1/problem.txt)
- [Task 2: Task Manager Problem Statement](https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions/blob/master/Task-2/problem.txt)
- [Task 3: Trial of the Cheater's Path Problem Statement](https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions/blob/master/Task-3/problem.txt)

In this blog, I'll only be discussing about Task 3 as Task 1 and Task 2 are quite easy and standard problems.


## Task 1

Task 1 was a classical ATM vending machine problem or a coin change problem. It was just a matter of modulo and repeat, and check if we were able to dispense the money or not.

You can find [my solution for the Task 1 here](https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions/tree/master/Task-1)

## Task 2

Task 2 was a task manager implementation which was just a matter of using priority_queue. Since I choose to do the problems with C++, I could simply make use of `std::priority_queue`, but I decided not to as the problem also required me to print the queue when requested. It is not possible to get the internal queue in std::priority_queue, other implementations like that of the Boost library do allow this, but what's the point of using a library when you can do it yourself and learn along.

I ended up using `std::vector` to store the tasks which were sorted using [`std::less<>`](https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions/blob/master/Task-2/TaskManager.cc#L6). This way I could insert tasks into the data structure with `O(log n)` time complexity and retrieve the top task with `O(1)` time complexity. And for getting the queue, I simply returned the internal `std::vector` which was already sorted.

You can find [my solution for the Task 2 here](https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions/tree/master/Task-2)

[`Task-2/TaskManager.cc`](https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions/blob/master/Task-2/TaskManager.cc) and [`Task-2/TaskManager.h`](https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions/blob/master/Task-2/TaskManager.h) contains the implementation for the queue/actual task manager.

## Task 3

Task 3 was a medium difficulty task, and the only one I found interesting enough. The puzzle wanted us to solve a maze such that each point had two options to navigate to, left (`L`) and right (`R`). The puzzle contained two pieces of information in the form of text files:

Instructions:
The directions to take each time. These directions are supposed to be repeated
`LLLRRRLRRLL.....`

These instructions could simply be parsed with a `switch` statement and going over the file character by character.

[`Task-3/parser.cc`](https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions/blob/master/Task-3/parser.cc#L15):
```cpp
auto parseInstruction(std::istream &inp) -> Instructions {
  Instructions directions = {};
  for (char ch = inp.get(); !inp.eof(); ch = inp.get()) {
    switch (ch) {
    case 'L':
      directions.emplace_back(Instruction::Left);
      break;
    case 'R':
      directions.emplace_back(Instruction::Right);
      break;
    default:
      throw std::runtime_error("Invalid character encountered in instruction file");
    }
  }
  return directions;
}
```

Here `Instruction` is simply an `enum class` with two members `Instruction::Left` and `Instruction::Right` which are the two directions which can be specified in the instrutions.

The map:
The other part was information about where the left and right directions take you from a particular position:
```
PGQ = (QRB, MJB)
JQC = (MNM, TLQ)
HNP = (NKD, PJT)
...
```

Noticing the pattern, we can store this as a `std::map` from `std::string` to `struct { std::string Left, Right; }`. Further to speed comparisions in future, we can convert 3-character strings to a number. Since 3-character strings containing letters `A-Z` have around `26*26*26` possibilities, which can fit into an `int16_t`. 

```cpp
auto parseNode(std::string str) -> Node {
  Node node = 0;
  for (int i = 0; i < 3; i++) {
    node *= 26;
    node += (str[i] - 'A');
  }
  return node;
}
```

Similarly `parseNode()` can also be declared for a `std::ifstream`


Now that we can parse nodes, we need to make sure that the file is parsing things correctly and holding proper syntax:

```cpp
auto parsePuzzle(std::istream &inp) -> Puzzle {
  Puzzle nodes;
  // This is intentionally an int instead of a char, as inp.get() will return an EOF which is supposed to be greater
  // than 255.
  int chr;
  while (true) {
    Node const node = parseNode(inp);
    Node left;
    Node right;
    chr = inp.get();
    MAKESURE_ELSE_ERROR_PARSING(chr == ' ');
    chr = inp.get();
    MAKESURE_ELSE_ERROR_PARSING(chr == '=');
    ...
    chr = inp.get();
    NodeData const nodeData = {
        .left = left,
        .right = right,
    };
    nodes.emplace(node, nodeData);
    if (inp.eof()) {
      break;
    }
    MAKESURE_ELSE_ERROR_PARSING(chr == '\n');
  }
  return nodes;
}
```

Here, `MAKESURE_ELSE_ERROR_PARSING` is just a helper macro that throws an exception if the file doesn't match the expected format. Also [`Puzzle` is just a typedef to `std::unordered_map<Node, NodeData>`](https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions/blob/master/Task-3/parser.h#L23). I used `std::unordered_map` instead of `std::map` as in unordered map, lookups have a time complexity of `O(n)`


### Part 1

We have to reach `ZZZ` starting from `AAA`. We can do this by simply following the instructions and counting the number of steps taken. `steps % instructions.size()` will give the number of instruction which we have to follow for that step. Then we can simply update the current node to the left or right node and repeat the process.

From [`Task-3/partOne.cc`](https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions/blob/master/Task-3/partOne.cc)
```cpp
uint64_t steps = 0;
for (Node currentNode = parseNode("AAA"); currentNode != parseNode("ZZZ"); steps++) {
switch (instructions[steps % instructions.size()]) {
case Instruction::Left:
  currentNode = puzzle.at(currentNode).left;
  break;
case Instruction::Right:
  currentNode = puzzle.at(currentNode).right;
  break;
}
}
```

### Part 2 

We have to start from every node starting with the letter `A` and reach node starting with letter `Z` at the same time from all starting position. This is a simple LCM problem, we simply find the minimum steps from each such node and then find the LCM of all these steps.

From [`Task-3/partTwo.cc`](https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions/blob/master/Task-3/partTwo.cc)
```cpp
// First find all the currentNodes that start with the letter 'A'
for (size_t i = 0; i != currentNodes.size(); i++) {
auto node = currentNodes[i];
// This is similar to partOne(), we are just finding the step where the node ends with a "Z"
for (; node % 26 != 25; steps[i]++) {
  switch (instructions[steps[i] % instructions.size()]) {
  case Instruction::Left:
    node = puzzle.at(node).left;
    break;
  case Instruction::Right:
    node = puzzle.at(node).right;
    break;
  }
}
...
// Return lcm of steps
```


## Building my solutions from source

I have provided a `CMakeLists.txt` file in the root of the git repository. There are instructions on how to build from source in the README.md of the GitHub repository. Follow them to build from source after obtain the source using git:

```sh
git clone https://github.com/thunder-coding/Hackslash-SigSTP2025-Solutions.git
```
