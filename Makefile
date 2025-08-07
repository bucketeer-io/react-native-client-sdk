.PHONY: publish-dry
publish-dry:
	npm publish --dry-run

.PHONY: publish
publish:
	npm publish --access public
