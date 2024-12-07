export const RequestButton = {
    create() {
        const button = document.createElement('button');
        button.className = 'listItem listItem-autoactive itemAction listItem-button listItemCursor listItem-hoverable navMenuOption navDrawerListItem';
        button.setAttribute('data-action', 'custom');
        button.setAttribute('data-custom', 'request-button');
        button.setAttribute('type', 'button');
        
        button.innerHTML = `
            <div title="Faire une requête" class="navMenuOption-listItem-content listItem-content listItem-content-bg listItemContent-touchzoom">
                <div data-action="custom" class="navDrawerListItemImageContainer listItemImageContainer listItemImageContainer-margin listItemImageContainer-square" style="aspect-ratio:1">
                    <i class="navDrawerListItemIcon listItemIcon md-icon autortl">add_to_queue</i>
                </div>
                <div class="navDrawerListItemBody listItemBody listItemBody-1-lines">
                    <div class="listItemBodyText listItemBodyText-nowrap listItemBodyText-lf">Faire une requête</div>
                </div>
            </div>
        `;

        return button;
    }
};