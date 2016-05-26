
# Responsive download templates can be put into a grid, or a table or other layouts

By editing the `download.html.twig` and the `download_container.html.twig` files in the `html/apps/` folder, you can create any design you would like for the downloads.

## Examples

### Grid downloads

First extend and edit the `download.html.twig` file, wrapping the entire file in:

```
<div class="pure-u-1 pure-u-md-1-3">
    ...
</div>
```

Then extend / edit the `downloads_container.html.twig` file, wrapping the `{{ downloads.all }}` line like so:

```
<div class="pure-g">
    {{ downloads.all }}
</div>
```

And that's it, your downloads on small screen will be full width but on medium and up screens the downloads will be in blocks of 3.

### Table downloads

First extend / edit the `downloads_container.html.twig` file, wrapping the `{{ downloads.all }}` line like so with the columns you'd like:

```
<div class="table-container">
    <table width="100%">
        <thead>
            <tr>
                <th>Name</th>
                <th>Size</th>
                <th>-</th>
            </tr>
        </thead>
        <tbody>
            {{ downloads.all }}
        </tbody>
    </table>
</div>
```

Then in the `download.html.twig` file, change it to be each table row, e.g. using the above download_container, you could make the download file to look like this:

```
<tr>
    <td>{{ download.name }}</td>
    <td>{{ download.size }}</td>
    <td><a download href="{{ download.href }}">Download</a></td>
</tr>
```

You can add any other columns you'd like to the above table and now you'll have a nicely organised table of downloads.
