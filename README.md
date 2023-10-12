# Designer and Coder Tools (Chrome Extension)

![Last Commit](https://img.shields.io/github/last-commit/Siphon880gh/web-designer-chrome-extension)
<a target="_blank" href="https://github.com/Siphon880gh/stocks-technical-analysis" rel="nofollow"><img src="https://img.shields.io/badge/GitHub--blue?style=social&logo=GitHub" alt="Github" data-canonical-src="https://img.shields.io/badge/GitHub--blue?style=social&logo=GitHub" style="max-width:10ch;"></a>
<a target="_blank" href="https://www.linkedin.com/in/weng-fung/" rel="nofollow"><img src="https://camo.githubusercontent.com/0f56393c2fe76a2cd803ead7e5508f916eb5f1e62358226112e98f7e933301d7/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c696e6b6564496e2d626c75653f7374796c653d666c6174266c6f676f3d6c696e6b6564696e266c6162656c436f6c6f723d626c7565" alt="Linked-In" data-canonical-src="https://img.shields.io/badge/LinkedIn-blue?style=flat&amp;logo=linkedin&amp;labelColor=blue" style="max-width:10ch;"></a>
<a target="_blank" href="https://www.youtube.com/user/Siphon880yt/" rel="nofollow"><img src="https://camo.githubusercontent.com/0bf5ba8ac9f286f95b2a2e86aee46371e0ac03d38b64ee2b78b9b1490df38458/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f596f75747562652d7265643f7374796c653d666c6174266c6f676f3d796f7574756265266c6162656c436f6c6f723d726564" alt="Youtube" data-canonical-src="https://img.shields.io/badge/Youtube-red?style=flat&amp;logo=youtube&amp;labelColor=red" style="max-width:10ch;"></a>

:page_facing_up: Description:
---
By Weng Fei Fung. 

Various tools to make the web designer and coder's job easier.

Quickly identify the colors, fonts, and spacing amounts of websites. 

Design an entirely new website or experiment with modifying the current website's layout inside Chrome with our huge selections of slides and components. You can swap website parts or add to the website from inside DevTools so you don't have to leave the current tab. Because the template code is conveniently in Tailwind 2 and Bootcamp 5, you can copy the produced HTML to another Tailwind/Bootcamp project.

Font Awesome 3-6 icons supported in the templates. For rearranging blocks, for now you have to drag and drop elements in the Elements panel. More development if interest in this extension is shown.

## :open_file_folder: Table of Contents:
---
- [Description](#page_facing_up-description)
- [Screenshots](#camera-screenshots)
- [Attribution](#handshake-attribution)
- [Developer Notes](#computer-developer-notes)
- [Future Version](#crystal_ball-future-version)
---

## :camera: Screenshots:

#### Design Guide Generator
![image](assets-readme/Design-Guide-Generator1.png)

#### Template Swapper or Site Builder
![image](assets-readme/Template-Swapper-or-Site-Builder.png)
#### Settings
<img alt="Settings screenshot" src="assets-readme/Settings.png" style="width:350px; height:150px; border:1px solid black;">

## :handshake: Attribution
Thanks to Freepik at Flaticon for the [icon](https://www.flaticon.com/free-icon/ux_1055666?term=design&page=1&position=6&origin=search&related_id=1055666).


## :computer: Developer Notes

To add more templates, add them to templates.html, unless they are textarea code that can easily be modified before inserting, then thoes go inside sidebar.html

The pattern is such (because code inside a script tag of type x-template will not be executed): 
```
<li>Name
    <script type="text/x-template" data-scale=".25">
    Your template whether bootstrap or tailwind
    </script>
</li>
```

If you have nested, you may do
```
<ul>
    <li>Name
        <script...>
    </li>
    <li>Name
        <script...>
    </li>
</ul>
```

If the template is too large for the sidebar, you can resize it down at the script tag.
`<script type="text/x-template" data-scale=".25">`

Which could cause it to be too far from the left or the top. You can additionally adjust like:
`<script type="text/x-template" data-scale=".25" data-margin-left="-50%" data-margin-top="-10px">`

You can inspect the sidebar to see what most templates are scaled at.

Your template script block can contain style blocks inside, but keep in mind that the style block does not override your other templates' styles which can affect their appearance in the sidebar or on the content page.

## :crystal_ball: Future version
- Future version will have paid tier with premium templates, personally modified template variations, and AI-filler with brand colors/fonts and content, if enough interest in this feature is shown.
- The paid version will connect to an API like https://###...com/main/engine/chrome-templates/ and checks your license code
- Detect if wordpress, squarespace, wix, etc.